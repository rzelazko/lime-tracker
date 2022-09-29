import { ChartOptions } from './../../../../shared/models/chart-options.model';
import { ChartData } from './../../../../shared/models/chart-data.model';
import { ChartHeatmapService } from './../../../../shared/services/chart-heatmap.service';
import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
  OnDestroy,
} from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexTitleSubtitle,
  ApexDataLabels,
  ApexChart,
  ChartComponent,
  ApexTooltip,
  ApexPlotOptions,
} from 'ng-apexcharts';
import { map, Subscription } from 'rxjs';

@Component({
  selector: 'app-chart-heatmap',
  templateUrl: './chart-heatmap.component.html',
  styleUrls: ['./chart-heatmap.component.scss'],
})
export class ChartHeatmapComponent implements OnInit, OnDestroy, OnChanges {
  @Input() selectedYear?: number;
  error?: string;
  subsription?: Subscription;
  chartOptions?: ChartOptions;

  constructor(private chartService: ChartHeatmapService) {
  }

  ngOnInit(): void {
  }

  ngOnChanges(_changes: SimpleChanges): void {
    this.chartService.setYear(this.selectedYear);

    this.subsription?.unsubscribe();
    this.subsription = this.chartService.seizureSerie().subscribe({
      next: (data: ChartData[]) => {
        this.chartOptions = {
          xaxis: {
            axisTicks: {
              show: false
            },
            labels: {
              show: false
            },
            tooltip: {
              enabled: false,
            },
          },
          yaxis: {
            show: false,
            seriesName: 'zz',
            labels: {
              formatter: (value: number, opts: { dataPointIndex: number, seriesIndex: number, w: any }, labels?: string[]) => {
                const realValue = value;
                if (opts && opts.w && opts.w.config && opts.w.config.series && opts.w.config.series[opts.seriesIndex]
                  && opts.w.config.series[opts.seriesIndex].data && opts.w.config.series[opts.seriesIndex].data[opts.dataPointIndex]
                  && opts.w.config.series[opts.seriesIndex].data[opts.dataPointIndex].label) {
                  return `${opts.w.config.series[opts.seriesIndex].data[opts.dataPointIndex].label}: ${realValue}`;
                }
                return realValue.toFixed(0);
              }
            },
          },
          markers: { },
          stroke: {},
          legend: {},
          fill: {},
          series: data,
          chart: {
            height: 250,
            type: 'heatmap',
          },
          dataLabels: {
            enabled: false,
          },
          title: {
            text: $localize`:@@chart-heatmap-title:Seizures during a year`,
            align: 'left',
            offsetX: 110,
          },
          subtitle: {
            text: this.chartService.subtitle(),
            align: 'left',
            offsetX: 110,
          },
          tooltip: {
          },
          plotOptions: {
            heatmap: {
              colorScale: {
                ranges: [
                  {
                    from: -1,
                    to: 0,
                    color: "#d3d6d9",
                    name: $localize`:@@chart-heatmap-legend-day-no-seizures:No seizures`
                  },
                  {
                    from: 1,
                    to: 1,
                    color: "#008ffb",
                    name: $localize`:@@chart-heatmap-legend-day-with-1-seizure:Day with one seizure`
                  },
                  {
                    from: 2,
                    to: 2,
                    color: "#0062ad",
                    name: $localize`:@@chart-heatmap-legend-day-with-2-seizures:Day with two seizures`
                  },
                  {
                    from: 3,
                    to: 1000,
                    color: "#00365e",
                    name: $localize`:@@chart-heatmap-legend-day-with-more-seizures:Day with more seizures`
                  },
                ]
              }
            }
          }
        }
      },
      error: (error) => (this.error = error.message),
    });
  }

  ngOnDestroy(): void {
    this.subsription?.unsubscribe();
  }

  public generateData(count: number, yrange: { min: number; max: number }) {
    var i = 0;
    var series = [];
    while (i < count) {
      var x = 'w' + (i + 1).toString();
      var y = Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;

      series.push({
        x: x,
        y: y,
      });
      i++;
    }
    return series;
  }
}
