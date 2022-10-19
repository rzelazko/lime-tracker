import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApexPlotOptions } from 'ng-apexcharts';
import { catchError, ignoreElements, map, Observable, of, switchMap } from 'rxjs';
import { ChartData } from './../../../../shared/models/chart-data.model';
import { ChartOptions } from './../../../../shared/models/chart-options.model';
import { ChartHeatmapService } from './../../../../shared/services/chart-heatmap.service';

@Component({
  selector: 'app-chart-heatmap',
  templateUrl: './chart-heatmap.component.html',
  styleUrls: ['./chart-heatmap.component.scss'],
})
export class ChartHeatmapComponent implements OnInit {
  @Input() titleOffset: number = 0;
  plotOptions: ApexPlotOptions;
  chartOptions$?: Observable<ChartOptions>;
  chartError$?: Observable<string>;

  constructor(private chartService: ChartHeatmapService, private activatedRoute: ActivatedRoute) {
    this.plotOptions = {
      heatmap: {
        colorScale: {
          ranges: [
            {
              from: -1,
              to: 0,
              color: '#d3d6d9',
              name: $localize`:@@chart-heatmap-legend-day-no-seizures:No seizures`,
            },
            {
              from: 1,
              to: 1,
              color: '#008ffb',
              name: $localize`:@@chart-heatmap-legend-day-with-1-seizure:Day with one seizure`,
            },
            {
              from: 2,
              to: 2,
              color: '#0062ad',
              name: $localize`:@@chart-heatmap-legend-day-with-2-seizures:Day with two seizures`,
            },
            {
              from: 3,
              to: 1000,
              color: '#00365e',
              name: $localize`:@@chart-heatmap-legend-day-with-more-seizures:Day with more seizures`,
            },
          ],
        },
      },
    };
  }

  ngOnInit(): void {
    this.chartOptions$ = this.activatedRoute.params.pipe(
      map((routeParams): number | undefined => routeParams['year']),
      switchMap((selectedYear) => {
        this.chartService.setYear(selectedYear);
        return this.chartService.seizureSerie();
      }),
      map((data: ChartData[]) => ({
        xaxis: {
          axisTicks: {
            show: false,
          },
          labels: {
            show: false,
          },
          tooltip: {
            enabled: false,
          },
        },
        yaxis: {
          show: false,
          seriesName: '',
          labels: {
            formatter: (
              value: number,
              opts: { dataPointIndex: number; seriesIndex: number; w: any },
              labels?: string[]
            ) => {
              const realValue = value;
              if (
                opts &&
                opts.w &&
                opts.w.config &&
                opts.w.config.series &&
                opts.w.config.series[opts.seriesIndex] &&
                opts.w.config.series[opts.seriesIndex].data &&
                opts.w.config.series[opts.seriesIndex].data[opts.dataPointIndex] &&
                opts.w.config.series[opts.seriesIndex].data[opts.dataPointIndex].label
              ) {
                return `${
                  opts.w.config.series[opts.seriesIndex].data[opts.dataPointIndex].label
                }: ${realValue}`;
              }
              return realValue.toFixed(0);
            },
          },
        },
        series: data,
        title: {
          text: $localize`:@@chart-heatmap-title:Seizures during a year`,
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
      catchError((error) => of($localize`:@@error-message:Error: ${error.message || error}`))
    );
  }
}
