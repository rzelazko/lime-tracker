import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { ApexAxisChartSeries, ApexYAxis } from 'ng-apexcharts';
import { combineLatest, map, Subscription } from 'rxjs';
import { ChartData } from './../../../../shared/models/chart-data.model';
import { ChartOptions } from './../../../../shared/models/chart-options.model';
import { ChartSummaryService } from './../../../../shared/services/chart-summary.service';

@Component({
  selector: 'app-chart-summary',
  templateUrl: './chart-summary.component.html',
  styleUrls: ['./chart-summary.component.scss'],
})
export class ChartSummaryComponent implements OnInit, OnDestroy, OnChanges {
  @Input() selectedYear?: number;
  error?: string;
  summaryChart?: ChartOptions;
  subsription?: Subscription;
  medicationsData?: ChartData[];
  eventsData?: ChartData;
  seizuresData?: ChartData;

  constructor(private chartService: ChartSummaryService) {}

  ngOnChanges(_changes: SimpleChanges): void {
    this.summaryChart = undefined;
    this.chartService.setYear(this.selectedYear);

    this.subsription?.unsubscribe();
    this.subsription = combineLatest([
      this.chartService.medicationsSeries().pipe(map((data) => (this.medicationsData = data))),
      this.chartService.eventsSerie().pipe(
        map((data) => ({ name: $localize`:@@title-events:Events`, ...data })),
        map((data) => (this.eventsData = data))
      ),
      this.chartService.seizureSerie().pipe(
        map((data) => ({ name: $localize`:@@title-seizures:Seizures`, ...data })),
        map((data) => (this.seizuresData = data))
      ),
    ]).subscribe({
      next: () => this.updateChart(),
      error: (error) => (this.error = $localize`:@@error-message:Error: ${error.message || error}`),
    });
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.subsription?.unsubscribe();
  }

  private updateChart() {
    const labelFormatter = (value: number, opts: { dataPointIndex: number }, labels?: string[]) => {
      if (labels && labels[opts?.dataPointIndex]) {
        return labels[opts.dataPointIndex];
      }
      return value.toFixed(0);
    };

    const yaxis: ApexYAxis[] = [];
    if (this.seizuresData && this.seizuresData.data.length > 0) {
      yaxis.push({
        opposite: false,
        axisTicks: { show: true },
        axisBorder: { show: true },
        seriesName: this.seizuresData.name,
        title: {
          text: this.seizuresData.name,
        },
      });
    }
    this.medicationsData?.forEach((medicationData, i) => {
      yaxis.push({
        show: i < 1,
        opposite: true,
        axisTicks: { show: true },
        axisBorder: { show: true },
        seriesName: this.medicationsData ? this.medicationsData[0].name : medicationData.name,
        title: {
          text: $localize`:@@chart-summary-med-per-day:Medication (per day)`,
        },
        labels: {
          formatter: (value: number, opts: { dataPointIndex: number }) =>
            labelFormatter(value, opts, medicationData.labels),
        },
      });
    });
    if (this.eventsData && this.eventsData.data.length > 0) {
      yaxis.push({
        show: false,
        axisTicks: { show: false },
        axisBorder: { show: false },
        seriesName: this.eventsData.name,
        title: {
          text: this.eventsData.name,
        },
        min: 0,
        tickAmount: 2,
        labels: {
          formatter: (value: number, opts: { dataPointIndex: number }) =>
            labelFormatter(value, opts, this.eventsData?.labels),
        },
      });
    }

    const series: ApexAxisChartSeries = [];
    if (this.seizuresData && this.seizuresData.data.length > 0) {
      series.push({
        name: this.seizuresData.name,
        type: 'column',
        data: this.seizuresData.data,
      });
    }
    this.medicationsData?.forEach((medicationData) => {
      series.push({
        name: medicationData.name,
        type: 'line',
        data: medicationData.data,
      });
    });

    if (this.eventsData && this.eventsData.data.length > 0) {
      series.push({
        name: this.eventsData.name,
        type: 'scatter',
        data: this.eventsData.data,
      });
    }

    this.summaryChart = {
      chart: { height: 350, type: 'line' },
      dataLabels: { enabled: false },
      stroke: { width: [1, 1, 4] },
      title: {
        text: $localize`:@@chart-summary-title:Seizures, medications & events`,
        align: 'left',
        offsetX: 110,
      },
      subtitle: {
        text: this.chartService.subtitle(),
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
