import { Component, Input } from '@angular/core';

@Component({
  selector: 'apx-chart',
  template: '<div></div>',
  standalone: true
})
export class MockApexChartsComponent {
  @Input() series: any;
  @Input() chart: any;
  @Input() xaxis: any;
  @Input() yaxis: any;
  @Input() dataLabels: any;
  @Input() plotOptions: any;
  @Input() title: any;
  @Input() subtitle: any;
}