import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { Event } from 'src/app/shared/event.model';

const MOCK_EVENTS: Event[] = [
  { id: 1, name: 'A lot of stress', occurred: moment('2021-04-12T04:00:00') },
  { id: 2, name: 'Start taking CBD oil', occurred: moment('2021-11-17T14:24:00') },
];

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss'],
})
export class EventsComponent implements OnInit {
  public data: Event[] = MOCK_EVENTS;

  public columns = ['name', 'occurred', 'actions'];

  constructor() {}

  ngOnInit(): void {}
}
