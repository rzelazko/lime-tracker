import { ApexAxisChartSeries, ApexTitleSubtitle, ApexXAxis, ApexYAxis } from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis | ApexYAxis[];
  title: ApexTitleSubtitle;
  subtitle: ApexTitleSubtitle;
};
