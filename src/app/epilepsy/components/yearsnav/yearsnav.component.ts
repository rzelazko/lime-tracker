import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-yearsnav',
  templateUrl: './yearsnav.component.html',
  styleUrls: ['./yearsnav.component.scss']
})
export class YearsnavComponent implements OnInit {
  @Output('onYearSelect') yearSelectEvent = new EventEmitter<number>();
  selectedYear?: number;
  currentYear = moment().year();

  constructor() { }

  ngOnInit(): void {
  }

  onYearSelect(year?: number) {
    this.selectedYear = year;
    this.yearSelectEvent.emit(year);
  }
}
