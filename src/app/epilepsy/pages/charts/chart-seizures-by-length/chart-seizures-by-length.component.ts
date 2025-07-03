import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { catchError, map, Observable, of, switchMap, ignoreElements } from 'rxjs';
import { ChartData } from './../../../../shared/models/chart-data.model';
import { ChartOptions } from './../../../../shared/models/chart-options.model';
import { ChartSeizuresByLengthService } from './../../../../shared/services/chart-seizures-by-length.service';

@Component({
    selector: 'app-chart-seizures-by-length',
    templateUrl: './chart-seizures-by-length.component.html',
    styleUrls: ['./chart-seizures-by-length.component.scss'],
    standalone: false
})
export class ChartSeizuresByLengthComponent implements OnInit {
  @Input() titleOffset: number = 0;
  chartOptions$?: Observable<ChartOptions>;
  chartError$?: Observable<string>;

  constructor(
    private chartService: ChartSeizuresByLengthService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.chartOptions$ = this.activatedRoute.params.pipe(
      map((routeParams): number | undefined => routeParams['year']),
      switchMap((selectedYear) => {
        this.chartService.setYear(selectedYear);
        return this.chartService.seizureSerie();
      }),
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
            text: $localize`:@@chart-seizures-by-length-axis-x:Duration (min)`
          },
          categories: data.data.map(d => d.x)
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
        series: [{
          name: $localize`:@@title-seizures:Seizures`,
          data: data.data.map(d => d.y)
        }],
        title: {
          text: $localize`:@@chart-seizures-by-length-title:Seizure count by duration`,
          align: 'left',
          offsetX: this.titleOffset,
        },
        subtitle: {
          text: this.chartService.subtitle(),
          align: 'left',
          offsetX: this.titleOffset,
        },
      }))
    );

    this.chartError$ = this.chartOptions$.pipe(
      ignoreElements(),
      catchError((error) => of($localize`:@@chart-error:Error: ${error.message || error}`))
    );
  }
}
