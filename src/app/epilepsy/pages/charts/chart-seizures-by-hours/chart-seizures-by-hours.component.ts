import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { catchError, ignoreElements, map, Observable, of, switchMap, distinctUntilChanged } from 'rxjs';
import { ChartData } from './../../../../shared/models/chart-data.model';
import { ChartOptions } from './../../../../shared/models/chart-options.model';
import { ChartSeizuresByHoursService } from './../../../../shared/services/chart-seizures-by-hours.service';

@Component({
    selector: 'app-chart-seizures-by-hours',
    templateUrl: './chart-seizures-by-hours.component.html',
    styleUrls: ['./chart-seizures-by-hours.component.scss'],
    standalone: false
})
export class ChartSeizuresByHoursComponent implements OnInit {
  @Input() titleOffset: number = 0;
  chartOptions$?: Observable<ChartOptions | null>;
  chartError$?: Observable<string>;

  constructor(
    private chartService: ChartSeizuresByHoursService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const dataStream$ = this.activatedRoute.params.pipe(
      map((routeParams): number | undefined => routeParams['year']),
      distinctUntilChanged((a, b) => a === b),
      switchMap((selectedYear: number | undefined) => {
        this.chartService.setYear(selectedYear);
        return this.chartService.seizureSerie();
      })
    );

    this.chartOptions$ = dataStream$.pipe(
      map((data: ChartData) => ({
        xaxis: {
          axisTicks: {
            show: false,
          },
          labels: {
            show: true,
          },
          tooltip: {
            enabled: false,
          },
          title: {
            text: $localize`:@@chart-seizures-by-hour-axis-x:Hour`,
          },
        },
        yaxis: {
          show: true,
          axisTicks: { show: true },
          axisBorder: { show: true },
          seriesName: $localize`:@@title-seizures:Seizures`,
          title: {
            text: $localize`:@@title-seizures:Seizures`,
          },
          labels: {
            formatter: (value: number, opts: { dataPointIndex: number }) => value.toFixed(0),
          },
        },
        series: [{ ...data, name: $localize`:@@title-seizures:Seizures` }],
        title: {
          text: $localize`:@@chart-seizures-by-hour-title:Amount of seizures per time of day`,
          align: 'left' as const,
          offsetX: this.titleOffset,
        },
        subtitle: {
          text: this.chartService.subtitle(),
          align: 'left' as const,
          offsetX: this.titleOffset,
        },
      } as any)),
      catchError(() => of(null))
    );

    this.chartError$ = dataStream$.pipe(
      ignoreElements(),
      catchError((error) => of($localize`:@@error-message:Error: ${error.message || error}`))
    );
  }
}
