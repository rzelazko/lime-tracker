import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApexAxisChartSeries, ApexYAxis } from 'ng-apexcharts';
import { combineLatest, map, Observable, of } from 'rxjs';
import { catchError, ignoreElements, switchMap } from 'rxjs/operators';
import { ChartData } from './../../../../shared/models/chart-data.model';
import { ChartOptions } from './../../../../shared/models/chart-options.model';
import { ChartSummaryService } from './../../../../shared/services/chart-summary.service';

@Component({
  selector: 'app-chart-summary',
  templateUrl: './chart-summary.component.html',
  styleUrls: ['./chart-summary.component.scss'],
})
export class ChartSummaryComponent implements OnInit {
  @Input() titleOffset: number = 0;
  chartOptions$?: Observable<ChartOptions>;
  chartError$?: Observable<string>;

  constructor(private chartService: ChartSummaryService, private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.chartOptions$ = this.activatedRoute.params.pipe(
      map((routeParams): number | undefined => routeParams['year']),
      switchMap((selectedYear) => {
        this.chartService.setYear(selectedYear);
        return combineLatest([
          this.chartService.medicationsSeries(),
          this.chartService
            .eventsSerie()
            .pipe(map((data) => ({ name: $localize`:@@title-events:Events`, ...data }))),
          this.chartService
            .seizureSerie()
            .pipe(map((data) => ({ name: $localize`:@@title-seizures:Seizures`, ...data }))),
        ]);
      }),
      map(([medicationsData, eventsData, seizuresData]) =>
        this.toChartOptions(medicationsData, eventsData, seizuresData)
      )
    );

    this.chartError$ = this.chartOptions$.pipe(
      ignoreElements(),
      catchError((error) => of($localize`:@@error-message:Error: ${error.message || error}`))
    );
  }

  private toChartOptions = (
    medicationsData: ChartData[],
    eventsData: ChartData,
    seizuresData: ChartData
  ): ChartOptions => {
    const yaxis: ApexYAxis[] = [];
    const series: ApexAxisChartSeries = [];

    if (seizuresData && seizuresData.data.length > 0) {
      yaxis.push({
        opposite: false,
        axisTicks: { show: true },
        axisBorder: { show: true },
        seriesName: seizuresData.name,
        title: {
          text: seizuresData.name,
        },
      });
      series.push({
        name: seizuresData.name,
        type: 'column',
        data: seizuresData.data,
      });
    }

    if (eventsData && eventsData.data.length > 0) {
      yaxis.push({
        show: false,
        axisTicks: { show: false },
        axisBorder: { show: false },
        seriesName: eventsData.name,
        title: {
          text: eventsData.name,
        },
        min: 0,
        tickAmount: 2,
        labels: {
          formatter: (value: number, opts: { dataPointIndex: number }) =>
            this.labelFormatter(value, opts, eventsData?.labels),
        },
      });
      series.push({
        name: eventsData.name,
        type: 'scatter',
        data: eventsData.data,
      });
    }

    medicationsData.forEach((medicationData, i) => {
      yaxis.push({
        show: i < 1,
        opposite: true,
        axisTicks: { show: true },
        axisBorder: { show: true },
        seriesName: medicationsData ? medicationsData[0].name : medicationData.name,
        title: {
          text: $localize`:@@chart-summary-med-per-day:Medication (per day)`,
        },
        labels: {
          formatter: (value: number, opts: { dataPointIndex: number }) =>
            this.labelFormatter(value, opts, medicationData.labels),
        },
      });

      series.push({
        name: medicationData.name,
        type: 'line',
        data: medicationData.data,
      });
    });

    return {
      title: {
        text: $localize`:@@chart-summary-title:Seizures, medications & events`,
        align: 'left',
        offsetX: this.titleOffset,
      },
      subtitle: {
        text: this.chartService.subtitle(),
        align: 'left',
        offsetX: this.titleOffset,
      },
      xaxis: { type: 'category' },
      yaxis,
      series,
    };
  };

  private labelFormatter = (value: number, opts: { dataPointIndex: number }, labels?: string[]) => {
    if (labels && labels[opts?.dataPointIndex]) {
      return labels[opts.dataPointIndex];
    }
    return value.toFixed(0);
  };
}
