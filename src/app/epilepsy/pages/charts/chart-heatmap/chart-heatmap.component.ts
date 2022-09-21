import { Component, OnInit, ViewChild } from "@angular/core";
import {
  ApexAxisChartSeries,
  ApexTitleSubtitle,
  ApexDataLabels,
  ApexChart,
  ChartComponent
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  title: ApexTitleSubtitle;
  colors: String[];
};

@Component({
  selector: 'app-chart-heatmap',
  templateUrl: './chart-heatmap.component.html',
  styleUrls: ['./chart-heatmap.component.scss']
})
export class ChartHeatmapComponent implements OnInit {
  public chartOptions: ChartOptions;

  constructor() {
    this.chartOptions = {
      series: [
        {
          name: "Monday",
          data: this.generateData(52, {
            min: 0,
            max: 90
          })
        },
        {
          name: "Tuesday",
          data: this.generateData(52, {
            min: 0,
            max: 90
          })
        },
        {
          name: "Wednesday",
          data: this.generateData(52, {
            min: 0,
            max: 90
          })
        },
        {
          name: "Thursday",
          data: this.generateData(52, {
            min: 0,
            max: 90
          })
        },
        {
          name: "Friday",
          data: this.generateData(52, {
            min: 0,
            max: 90
          })
        },
        {
          name: "Saturday",
          data: this.generateData(52, {
            min: 0,
            max: 90
          })
        },
        {
          name: "Sunday",
          data: this.generateData(52, {
            min: 0,
            max: 90
          })
        }
      ],
      chart: {
        height: 250,
        type: "heatmap"
      },
      dataLabels: {
        enabled: false
      },
      colors: ["#008FFB"],
      title: {
        text: $localize`:@@chart-heatmap-title:Seizures during a year`,
        align: 'left',
        offsetX: 110,
      }
    };
  }

  ngOnInit(): void {
  }

  public generateData(count:number, yrange:{min:number, max:number}) {
    var i = 0;
    var series = [];
    while (i < count) {
      var x = "w" + (i + 1).toString();
      var y =
        Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;

      series.push({
        x: x,
        y: y
      });
      i++;
    }
    return series;
  }
}
