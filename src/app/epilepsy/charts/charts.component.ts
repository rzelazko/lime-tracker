import { Component, OnInit, ViewChild } from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexFill,
  ApexLegend,
  ApexMarkers,
  ApexStroke,
  ApexTitleSubtitle,
  ApexTooltip,
  ApexXAxis,
  ApexYAxis,
  ChartComponent,
} from 'ng-apexcharts';

export type AppChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  markers: ApexMarkers;
  stroke: ApexStroke;
  yaxis: ApexYAxis | ApexYAxis[];
  dataLabels: ApexDataLabels;
  title: ApexTitleSubtitle;
  subtitle: ApexTitleSubtitle;
  legend: ApexLegend;
  fill: ApexFill;
  tooltip: ApexTooltip;
};

export type AppChart = {
  name: string;
  data: { x: string; y: number }[];
  labels?: string[];
};

const appKepraSerie: AppChart = {
  name: 'Kepra',
  data: [
    { x: 'Jan', y: 100 },
    { x: 'Feb', y: 100 },
    { x: 'Mar', y: 100 },
    { x: 'Apr', y: 100 },
    { x: 'May', y: 125 },
    { x: 'Jun', y: 125 },
    { x: 'Jul', y: 125 },
    { x: 'Aug', y: 125 },
    { x: 'Sep', y: 125 },
    { x: 'Oct', y: 125 },
    { x: 'Nov', y: 125 },
    { x: 'Dec', y: 125 },
  ],
};

const appAttackSerie: AppChart = {
  name: 'Attacks',
  data: [
    { x: 'Jan', y: 1 },
    { x: 'Feb', y: 2 },
    { x: 'Mar', y: 0 },
    { x: 'Apr', y: 1 },
    { x: 'May', y: 0 },
    { x: 'Jun', y: 3 },
    { x: 'Jul', y: 1 },
    { x: 'Aug', y: 3 },
    { x: 'Sep', y: 5 },
    { x: 'Oct', y: 1 },
    { x: 'Nov', y: 2 },
    { x: 'Dec', y: 5 },
  ],
};

const appEventsSerie: AppChart = {
  name: 'Events',
  data: [
    { x: 'Jan', y: -1 },
    { x: 'Feb', y: 2 },
    { x: 'Mar', y: -1 },
    { x: 'Apr', y: 1 },
    { x: 'May', y: -1 },
    { x: 'Jun', y: -1 },
    { x: 'Jul', y: -1 },
    { x: 'Aug', y: -1 },
    { x: 'Sep', y: -1 },
    { x: 'Oct', y: 1 },
    { x: 'Nov', y: -1 },
    { x: 'Dec', y: -1 },
  ],
  labels: [
    '', // Jan
    'CBD, Neurologist visit', // Feb - 2
    '', // Mar
    'Lot of stress with X', // Apr - 1
    '', // May
    '', // Jun
    '', // Jul
    '', // Aug
    '', // Sep
    'Started new job', // Oct - 1
    '', // Nov
    '', // Dec
  ],
};

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.scss'],
})
export class ChartsComponent implements OnInit {
  @ViewChild('chart') chart?: ChartComponent;
  public chartOptions: AppChartOptions;

  constructor() {
    this.chartOptions = {
      chart: {
        height: 350,
        type: 'line',
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        width: [1, 1, 4],
      },
      title: {
        text: 'Sizures - Medicaments - Events',
        align: 'left',
        offsetX: 110,
      },
      subtitle: {
        text: 'January - December 2021',
        align: 'left',
        offsetX: 110,
      },
      fill: {
        type: 'solid',
      },
      markers: {
        size: [6, 6],
      },
      tooltip: {
        shared: false,
        intersect: true,
      },
      legend: {
        show: true,
      },
      xaxis: {
        type: 'category',
      },
      yaxis: [
        {
          opposite: false,
          axisTicks: {
            show: true,
          },
          axisBorder: {
            show: true,
          },
          seriesName: appAttackSerie.name,
        },
        {
          opposite: true,
          axisTicks: {
            show: true,
          },
          axisBorder: {
            show: true,
          },
          seriesName: appKepraSerie.name,
        },
        {
          show: false,
          axisTicks: {
            show: false,
          },
          axisBorder: {
            show: false,
          },
          seriesName: appEventsSerie.name,
          min: 0,
          tickAmount: 2,
          labels: {
            formatter: function (
              value: number,
              opts: { dataPointIndex: number }
            ) {
              if (
                appEventsSerie.labels &&
                appEventsSerie.labels[opts.dataPointIndex]
              ) {
                return appEventsSerie.labels[opts.dataPointIndex];
              }
              return value.toFixed(0);
            },
          },
        },
      ],
      series: [
        {
          name: appAttackSerie.name,
          type: 'column',
          data: appAttackSerie.data,
        },
        {
          name: appKepraSerie.name,
          type: 'line',
          data: appKepraSerie.data,
        },
        {
          name: appEventsSerie.name,
          type: 'scatter',
          data: appEventsSerie.data,
        },
      ],
    };
  }
  ngOnInit(): void {}
}
