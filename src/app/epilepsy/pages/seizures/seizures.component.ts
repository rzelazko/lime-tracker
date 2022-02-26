import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { Seizure } from 'src/app/shared/seizure.model';

const MOCK_SEIZURES: Seizure[] =  [
  {
    id: 1,
    occurred: moment('2021-12-24T14:24:00'),
    type: 'Type F',
    duration: moment.duration(460, 'seconds'),
  },
  {
    id: 2,
    occurred: moment('2021-12-22T14:24:00'),
    type: 'Type D',
    duration: moment.duration(300, 'seconds'),
  },
  {
    id: 3,
    occurred: moment('2021-12-15T14:24:00'),
    type: 'Type A',
    duration: moment.duration(180, 'seconds'),
  },
  {
    id: 4,
    occurred: moment('2021-12-10T14:24:00'),
    type: 'Type B',
    duration: moment.duration(240, 'seconds'),
  },
  {
    id: 5,
    occurred: moment('2021-12-05T14:24:00'),
    type: 'Type A',
    duration: moment.duration(300, 'seconds'),
  },
  {
    id: 6,
    occurred: moment('2021-09-30T11:24:00'),
    type: 'Type A',
    duration: moment.duration(460, 'seconds'),
  },
  {
    id: 7,
    occurred: moment('2021-09-27T19:24:00'),
    type: 'Type B',
    duration: moment.duration(300, 'seconds'),
  },
  {
    id: 8,
    occurred: moment('2021-09-17T19:24:00'),
    type: 'Type C',
    duration: moment.duration(260, 'seconds'),
  },
  {
    id: 9,
    occurred: moment('2021-09-02T19:24:00'),
    type: 'Type B',
    duration: moment.duration(300, 'seconds'),
  },
];

@Component({
  selector: 'app-seizures',
  templateUrl: './seizures.component.html',
  styleUrls: ['./seizures.component.scss'],
})
export class SeizuresComponent implements OnInit {
  public data: Seizure[] = MOCK_SEIZURES;

  public columns = [
    'occurred', 'type', 'duration', 'actions'
  ]

  constructor() {}

  ngOnInit(): void {}
}
