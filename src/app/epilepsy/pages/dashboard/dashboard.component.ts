import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { Duration, Moment } from 'moment';
import { Medicament } from 'src/app/shared/models/medicament.model';

const MOCK_MEDICAMENTS: Medicament[] = [
  { id: "1", name: 'Kepra', doses: {morning: 100, noon: 0, evening: 150 }, startDate: moment('2021-06-01')},
  { id: "2", name: 'Lamitrin', doses: {morning: 1500, noon: 0, evening: 1000 }, startDate: moment('2021-06-01') },
  { id: "3", name: 'Topamax', doses: {morning: 125, noon: 0, evening: 125 }, startDate: moment('2021-09-01')}
];

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  medicaments: Medicament[] = MOCK_MEDICAMENTS;
  lastSeizure?: Moment;
  timeSinceLastSeizure?: Duration;

  constructor() {}

  ngOnInit(): void {
    const now = moment();
    this.lastSeizure = now.clone().subtract(5, 'days');
    this.timeSinceLastSeizure = moment.duration(now.diff(this.lastSeizure));
  }
}
