import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.scss'],
})
export class ChartsComponent implements OnInit {
  selectedYear?: number;

  constructor() {}

  ngOnInit(): void {}

  onYearSelect(year?: number) {
    this.selectedYear = year;
  }
}
