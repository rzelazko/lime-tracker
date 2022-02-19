import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { Duration, Moment } from 'moment';
import { Medicament } from './../../shared/medicament.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  medicaments: Medicament[] = [];
  lastSeizure?: Moment;
  timeSinceLastSeizure?: Duration;

  constructor() {}

  ngOnInit(): void {
    const now = moment();
    this.medicaments.push(
      { name: 'Kepra', doses: {morning: 100, noon: 0, evening: 150 }, startDate: moment('2021-06-01')},
      { name: 'Lamitrin', doses: {morning: 1500, noon: 0, evening: 1000 }, startDate: moment('2021-06-01') },
      { name: 'Topamax', doses: {morning: 125, noon: 0, evening: 125 }, startDate: moment('2021-09-01')}
    );
    this.lastSeizure = now.clone().subtract(5, 'days');
    this.timeSinceLastSeizure = moment.duration(now.diff(this.lastSeizure));
  }
}
