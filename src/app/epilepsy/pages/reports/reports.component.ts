import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { Attack } from 'src/app/shared/attack.model';
import { Event } from 'src/app/shared/event.model';
import { Medicament } from 'src/app/shared/medicament.model';
import { Report } from './report.model';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
})
export class ReportsComponent implements OnInit {
  public report?: Report;

  constructor() {}

  ngOnInit(): void {
    const now = moment();
    this.report = {
      dateStart: now.subtract(moment.duration(6).months()),
      dateEnd: now,
      subReports: [
        {
          dateStart: moment('2021-12-01'),
          dateEnd: moment('2021-12-31'),
          cases: [
            { attack: { occured: moment('2021-12-24T14:24:00'), type: 'Type F', duration: moment.duration(460, 'seconds') } },
            { attack: { occured: moment('2021-12-22T14:24:00'), type: 'Type D', duration: moment.duration(300, 'seconds') } },
            { attack: { occured: moment('2021-12-15T14:24:00'), type: 'Type A', duration: moment.duration(180, 'seconds') } },
            { attack: { occured: moment('2021-12-10T14:24:00'), type: 'Type B', duration: moment.duration(240, 'seconds') } },
            { attack: { occured: moment('2021-12-05T14:24:00'), type: 'Type A', duration: moment.duration(300, 'seconds') } },
            { event: { name: 'A lot of stress', occurred: moment('2021-04-12T04:00:00') } },
          ],
        },
        {
          dateStart: moment('2021-11-01'),
          dateEnd: moment('2021-11-30'),
          cases: [
            { attack: { occured: moment('2021-11-30T12:24:00'), type: 'Type A', duration: moment.duration(180, 'seconds') } },
            { event: { name: 'Start taking CBD oil', occurred: moment('2021-11-17T14:24:00') } },
            { attack: { occured: moment('2021-11-01T03:24:00'), type: 'Type B', duration: moment.duration(460, 'seconds') } },
          ],
        },
        {
          dateStart: moment('2021-10-01'),
          dateEnd: moment('2021-10-31'),
          cases: [
            { attack: { occured: moment('2021-10-10T14:24:00'), type: 'Type A', duration: moment.duration(240, 'seconds') } },
          ],
        },
        {
          dateStart: moment('2021-09-01'),
          dateEnd: moment('2021-09-30'),
          cases: [
            { attack: { occured: moment('2021-09-30T11:24:00'), type: 'Type A', duration: moment.duration(460, 'seconds') } },
            { attack: { occured: moment('2021-09-27T19:24:00'), type: 'Type B', duration: moment.duration(300, 'seconds') } },
            { attack: { occured: moment('2021-09-17T19:24:00'), type: 'Type C', duration: moment.duration(260, 'seconds') } },
            { attack: { occured: moment('2021-09-02T19:24:00'), type: 'Type B', duration: moment.duration(300, 'seconds') } },
            {
              medicament: {
                name: 'Topamax',
                doses: { morning: 125, noon: 0, evening: 150 },
                startDate: moment('2021-09-01'),
              },
            },
          ],
        },
        {
          dateStart: moment('2021-08-01'),
          dateEnd: moment('2021-08-31'),
          cases: [
            { attack: { occured: moment('2021-08-22T19:24:00'), type: 'Type B', duration: moment.duration(300, 'seconds') } },
            { attack: { occured: moment('2021-08-12T19:24:00'), type: 'Type A', duration: moment.duration(180, 'seconds') } },
            { attack: { occured: moment('2021-08-02T19:24:00'), type: 'Type B', duration: moment.duration(300, 'seconds') } },
          ],
        },
        {
          dateStart: moment('2021-07-01'),
          dateEnd: moment('2021-07-31'),
          cases: [
            { attack: { occured: moment('2021-07-31T19:24:00'), type: 'Type B', duration: moment.duration(300, 'seconds') } },
          ],
        },
        {
          dateStart: moment('2021-06-01'),
          dateEnd: moment('2021-06-30'),
          cases: [
            {
              medicament: {
                name: 'Kepra',
                doses: { morning: 100, noon: 0, evening: 150 },
                startDate: moment('2021-06-01'),
              },
            },
            {
              medicament: {
                name: 'Lamitrin',
                doses: { morning: 1500, noon: 0, evening: 1000 },
                startDate: moment('2021-06-01'),
              },
            },
            {
              medicament: {
                name: 'Topamax',
                doses: { morning: 125, noon: 0, evening: 125 },
                startDate: moment('2021-06-01'),
              },
            },
            { attack: { occured: moment('2021-06-28T19:24:00'), type: 'Type F', duration: moment.duration(460, 'seconds') } },
            { attack: { occured: moment('2021-06-20T19:24:00'), type: 'Type B', duration: moment.duration(300, 'seconds') } },
            { attack: { occured: moment('2021-06-19T19:24:00'), type: 'Type D', duration: moment.duration(240, 'seconds') } },
          ],
        },
      ],
    };
  }
}
