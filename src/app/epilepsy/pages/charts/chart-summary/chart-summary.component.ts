import { Component, inject, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApexAxisChartSeries, ApexYAxis } from 'ng-apexcharts';
import { combineLatest, map, Observable, of, startWith } from 'rxjs';
import { catchError, ignoreElements, switchMap, distinctUntilChanged, shareReplay } from 'rxjs/operators';
import { ChartData } from './../../../../shared/models/chart-data.model';
import { ChartOptions } from './../../../../shared/models/chart-options.model';
import { ChartSummaryService } from './../../../../shared/services/chart-summary.service';

@Component({
    selector: 'app-chart-summary',
    templateUrl: './chart-summary.component.html',
    styleUrls: ['./chart-summary.component.scss'],
    standalone: false
})
export class ChartSummaryComponent implements OnInit {
  @Input() titleOffset: number = 0;
  chartOptions$?: Observable<ChartOptions | null>;
  chartError$?: Observable<string>;

  private chartService: ChartSummaryService = inject(ChartSummaryService);
  private activatedRoute: ActivatedRoute = inject(ActivatedRoute);

  ngOnInit(): void {
    const routeParams$ = this.activatedRoute?.params ?? of(this.activatedRoute?.snapshot?.params ?? {});
    const data$ = routeParams$.pipe(
      startWith(this.activatedRoute?.snapshot?.params ?? {}),
      map((routeParams): number | undefined => routeParams['year']),
      distinctUntilChanged((a, b) => a === b),
      switchMap((selectedYear: number | undefined) => {
        this.chartService.setYear(selectedYear);
        return combineLatest([
          this.chartService
            .eventsSerie()
            .pipe(map((data) => ({ name: $localize`:@@title-events:Events`, ...data }))),
          this.chartService
            .seizureSerie()
            .pipe(map((data) => ({ name: $localize`:@@title-seizures:Seizures`, ...data }))),
        ]);
      }),
      shareReplay({ bufferSize: 1, refCount: true })
    );

    this.chartOptions$ = data$.pipe(
      map(([eventsData, seizuresData]) =>
        this.toChartOptions(eventsData, seizuresData)
      )
    );

    this.chartError$ = data$.pipe(
      ignoreElements(),
      catchError((error) => of($localize`:@@error-message:Error: ${error.message || error}`))
    );
  }

  private toChartOptions = (
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

    if (eventsData && eventsData.data.some((d) => d.y !== -1)) {
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
