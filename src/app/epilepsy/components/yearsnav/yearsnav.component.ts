import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';
import moment from 'moment';

@Component({
    selector: 'app-yearsnav',
    templateUrl: './yearsnav.component.html',
    styleUrls: ['./yearsnav.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class YearsnavComponent implements OnInit {
  @Input() public linkPrefix?: string;
  currentYear = moment().year();
  availableYears = Array.from({ length: 10 }, (_v, k) => this.currentYear - k);

  ngOnInit(): void {}
}
