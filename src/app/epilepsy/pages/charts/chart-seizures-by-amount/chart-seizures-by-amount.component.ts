import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { catchError, map, Observable, of, ignoreElements } from 'rxjs';
import { ChartOptions } from '../../../../shared/models/chart-options.model';
import { ChartSeizuresByAmountService } from '../../../../shared/services/chart-seizures-by-amount.service';
import { ApexAxisChartSeries } from 'ng-apexcharts';
import Moment from 'moment';
import { extendMoment } from 'moment-range';

const moment = extendMoment(Moment as any);

@Component({
  selector: 'app-chart-seizures-by-amount',
  templateUrl: './chart-seizures-by-amount.component.html',
  styleUrls: ['./chart-seizures-by-amount.component.scss'],
  standalone: false,
})
export class ChartSeizuresByAmountComponent implements OnInit, OnChanges {
  @Input() by: 'month' | 'year' = 'year';
  @Input() amount: number = 5;
  @Input() titleOffset = 0;

  chartOptions$?: Observable<ChartOptions>;
  chartError$?: Observable<string>;

  constructor(private chartService: ChartSeizuresByAmountService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if ((changes['by'] && !changes['by'].firstChange) || (changes['amount'] && !changes['amount'].firstChange)) {
      this.loadChart();
    }
  }

  ngOnInit(): void {
    this.loadChart();
  }

  private loadChart(): void {
    this.chartOptions$ = this.chartService.seizureSerie(this.by, this.amount).pipe(
      map((seriesData: ApexAxisChartSeries) => ({
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
            text: this.by === 'year' ? $localize`:@@year:Year` : $localize`:@@month:Month`
          },
          categories: this.by === 'year'
            ? (seriesData[0].data as { x: string; y: number }[]).map(d => d.x)
            : moment.monthsShort()
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
            formatter: (value: number) => value.toFixed(0),
          },
        },
        series: seriesData,
        title: {
          text: this.by === 'year' ? $localize`:@@chart-seizures-by-year-title:Seizure count by year` : $localize`:@@chart-seizures-by-month-title:Seizure count by month`,
          align: 'left',
          offsetX: this.titleOffset,
        },
        subtitle: {
            text: $localize`:@@chart-seizures-subtitle:Last ${this.amount} years`,
            align: 'left',
            offsetX: this.titleOffset,
        }
      }))
    );

    this.chartError$ = this.chartOptions$.pipe(
      ignoreElements(),
      catchError((error) => of($localize`:@@chart-error:Error: ${error.message || error}`))
    );
  }
}
