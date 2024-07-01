import { Component, Input, OnInit } from '@angular/core';
import moment from 'moment';

@Component({
  selector: 'app-yearsnav',
  templateUrl: './yearsnav.component.html',
  styleUrls: ['./yearsnav.component.scss'],
})
export class YearsnavComponent implements OnInit {
  @Input() public linkPrefix?: string;
  currentYear = moment().year();
  availableYears = Array.from({ length: 10 }, (_v, k) => this.currentYear - k);

  constructor() {}

  ngOnInit(): void {}
}
