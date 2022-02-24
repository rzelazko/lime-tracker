import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { Seizure } from 'src/app/shared/seizure.model';

@Component({
  selector: 'app-seizures-list',
  templateUrl: './seizures-list.component.html',
  styleUrls: ['./seizures-list.component.scss'],
})
export class SeizuresListComponent implements OnInit {
  public data: Seizure[] = [
    {
      occurred: moment('2021-12-24T14:24:00'),
      type: 'Type F',
      duration: moment.duration(460, 'seconds'),
    },
    {
      occurred: moment('2021-12-22T14:24:00'),
      type: 'Type D',
      duration: moment.duration(300, 'seconds'),
    },
    {
      occurred: moment('2021-12-15T14:24:00'),
      type: 'Type A',
      duration: moment.duration(180, 'seconds'),
    },
    {
      occurred: moment('2021-12-10T14:24:00'),
      type: 'Type B',
      duration: moment.duration(240, 'seconds'),
    },
    {
      occurred: moment('2021-12-05T14:24:00'),
      type: 'Type A',
      duration: moment.duration(300, 'seconds'),
    },
    {
      occurred: moment('2021-09-30T11:24:00'),
      type: 'Type A',
      duration: moment.duration(460, 'seconds'),
    },
    {
      occurred: moment('2021-09-27T19:24:00'),
      type: 'Type B',
      duration: moment.duration(300, 'seconds'),
    },
    {
      occurred: moment('2021-09-17T19:24:00'),
      type: 'Type C',
      duration: moment.duration(260, 'seconds'),
    },
    {
      occurred: moment('2021-09-02T19:24:00'),
      type: 'Type B',
      duration: moment.duration(300, 'seconds'),
    },
  ];

  public columns = [
    'occurred', 'type', 'duration', 'actions'
  ]

  constructor() {}

  ngOnInit(): void {}
}
