import { Component, OnInit, ViewChild } from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexChart, ApexDataLabels, ApexFill, ApexLegend, ApexMarkers, ApexStroke, ApexTitleSubtitle, ApexTooltip,
  ApexXAxis, ApexYAxis, ChartComponent
} from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  markers: ApexMarkers;
  stroke: ApexStroke;
  yaxis: ApexYAxis | ApexYAxis[];
  dataLabels: ApexDataLabels;
  title: ApexTitleSubtitle;
  legend: ApexLegend;
  fill: ApexFill;
  tooltip: ApexTooltip;
};

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.scss'],
})
export class ChartsComponent implements OnInit {
  @ViewChild('chart') chart?: ChartComponent;
  public chartOptions: ChartOptions;

  constructor() {
    this.chartOptions = {
      chart: {
        height: 350,
        type: 'line',
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        width: [1, 1, 4]
      },
      title: {
        text: "Sizures - Medicaments - Events (2021)",
        align: "left",
        offsetX: 110
      },
      fill: {
        type: 'solid',
      },
      markers: {
        size: [6, 2],
      },
      tooltip: {
        shared: false,
        intersect: true,
      },
      legend: {
        show: true,
      },
      xaxis: {
        type: 'numeric',
        min: 1,
        max: 12,
        /*tickAmount: 1,
      labels: {
        formatter: function (value) {
          return value;
        }
      }*/
      },
      yaxis: [
        {
          opposite: true,
          axisTicks: {
            show: true,
          },
          axisBorder: {
            show: true,
          },
          seriesName: 'Kepra',
        },
        {
          opposite: true,
          axisTicks: {
            show: true,
          },
          axisBorder: {
            show: true,
          },
          seriesName: 'Attacks',
        },
        {
          axisTicks: {
            show: true,
          },
          axisBorder: {
            show: true,
          },
          seriesName: 'Events',
        },
      ],
      series: [
        {
          name: 'Kepra',
          type: 'line',
          data: [
            {
              x: 1,
              y: 100,
            },
            {
              x: 2,
              y: 100,
            },
            {
              x: 3,
              y: 100,
            },
            {
              x: 4,
              y: 100,
            },
            {
              x: 5,
              y: 125,
            },
            {
              x: 6,
              y: 125,
            },
            {
              x: 7,
              y: 125,
            },
            {
              x: 8,
              y: 125,
            },
            {
              x: 9,
              y: 125,
            },
            {
              x: 10,
              y: 125,
            },
            {
              x: 11,
              y: 125,
            },
            {
              x: 12,
              y: 125,
            },
          ],
        },
        {
          name: 'Attacks',
          type: 'column',
          data: [
            { x: 1, y: 1 },
            { x: 2, y: 2 },
            { x: 3, y: 0 },
            { x: 4, y: 1 },
            { x: 5, y: 0 },
            { x: 6, y: 3 },
            { x: 8, y: 3 },
            { x: 9, y: 5 },
            { x: 10, y: 2 },
            { x: 11, y: 1 },
            { x: 12, y: 5 },
          ],
        },
        {
          name: 'Events',
          type: 'scatter',
          data: [
            {
              x: 1,
              y: 2,
            },
            {
              x: 5,
              y: 1,
            },
            {
              x: 6,
              y: 1,
            },
            {
              x: 8,
              y: 1,
            },
            {
              x: 11,
              y: 1,
            },
          ],
        },
      ],
    };
  }
  ngOnInit(): void {}
}
