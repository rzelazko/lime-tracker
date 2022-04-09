import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { ApexAxisChartSeries, ApexYAxis } from 'ng-apexcharts';
import { firstValueFrom, map, Observable } from 'rxjs';
import { ChartData } from '../../../../shared/models/chart-data.model';
import { ChartOptions } from '../../../../shared/models/chart-options.model';
import { SummaryChartService } from '../../../../shared/services/summary-chart.service';


@Component({
  selector: 'app-chart-summary',
  templateUrl: './chart-summary.component.html',
  styleUrls: ['./chart-summary.component.scss']
})
export class ChartSummaryComponent implements OnInit, OnChanges {
  @Input() selectedYear?: number;
  error?: string;
  summaryChart?: ChartOptions;

  constructor(private summaryChartService: SummaryChartService) {
    this.summaryChartService.setYear(this.selectedYear);
  }

  async ngOnChanges(_changes: SimpleChanges): Promise<void> {
    this.summaryChart = undefined;
    this.summaryChartService.setYear(this.selectedYear);
    try {
      const medicamentsData = await firstValueFrom(this.summaryChartService.medicamentSeries());
      const eventsData = await firstValueFrom(
        this.summaryChartService.eventsSerie().pipe(map((data) => ({ name: 'Events', ...data })))
      );
      const seizuresData = await firstValueFrom(
        this.summaryChartService.seizureSerie().pipe(map((data) => ({ name: 'Seizures', ...data })))
      );

      this.initSummaryChart(
        this.summaryChartService.subtitle(),
        medicamentsData,
        eventsData,
        seizuresData
      );
    } catch (error) {
      this.error = error instanceof Error ? error.message : 'Unknown error';
    }
  }

  ngOnInit(): void {

  }

  private initSummaryChart(
    subtitle: string,
    medicamentsData: ChartData[],
    eventsData: ChartData,
    seizuresData: ChartData
  ) {
    const labelFormatter = (value: number, opts: { dataPointIndex: number }, labels?: string[]) => {
      if (labels && labels[opts?.dataPointIndex]) {
        return labels[opts.dataPointIndex];
      }
      return value.toFixed(0);
    };

    const yaxis: ApexYAxis[] = [];
    if (seizuresData.data.length > 0) {
      yaxis.push({
        opposite: false,
        axisTicks: { show: true },
        axisBorder: { show: true },
        seriesName: seizuresData.name,
        title: {
          text: seizuresData.name
        },
      });
    }
    medicamentsData.forEach((medicamentData) => {
      yaxis.push({
        opposite: true,
        axisTicks: { show: true },
        axisBorder: { show: true },
        seriesName: medicamentData.name,
        title: {
          text: `${medicamentData.name} (per day)`
        },
        labels: {
          formatter: (value: number, opts: { dataPointIndex: number }) =>
            labelFormatter(value, opts, medicamentData.labels),
        },
      });
    });
    if (eventsData.data.length > 0) {
      yaxis.push({
        show: false,
        axisTicks: { show: false },
        axisBorder: { show: false },
        seriesName: eventsData.name,
        title: {
          text: eventsData.name
        },
        min: 0,
        tickAmount: 2,
        labels: {
          formatter: (value: number, opts: { dataPointIndex: number }) =>
            labelFormatter(value, opts, eventsData.labels),
        },
      });
    }

    const series: ApexAxisChartSeries = [];
    if (seizuresData.data.length > 0) {
      series.push({
        name: seizuresData.name,
        type: 'column',
        data: seizuresData.data,
      });
    }
    medicamentsData.forEach((medicamentData) => {
      series.push({
        name: medicamentData.name,
        type: 'line',
        data: medicamentData.data,
      });
    });

    if (eventsData.data.length > 0) {
      series.push({
        name: eventsData.name,
        type: 'scatter',
        data: eventsData.data,
      });
    }

    this.summaryChart = {
      chart: { height: 350, type: 'line' },
      dataLabels: { enabled: false },
      stroke: { width: [1, 1, 4] },
      title: {
        text: 'Seizures, medicaments & events',
        align: 'left',
        offsetX: 110,
      },
      subtitle: {
        text: subtitle,
        align: 'left',
        offsetX: 110,
      },
      fill: { type: 'solid' },
      markers: { size: [6, 6] },
      tooltip: { shared: false, intersect: true },
      legend: { show: true },
      xaxis: { type: 'category' },
      yaxis,
      series,
    };
  }
}
