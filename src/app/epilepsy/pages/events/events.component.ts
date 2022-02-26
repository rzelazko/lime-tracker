import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { Event } from 'src/app/shared/event.model';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss'],
})
export class EventsComponent implements OnInit {
  public data: Event[] = [
    { name: 'A lot of stress', occurred: moment('2021-04-12T04:00:00') },
    { name: 'Start taking CBD oil', occurred: moment('2021-11-17T14:24:00') },
  ];

  public columns = [
    'name', 'occurred', 'actions'
  ];

  constructor() {}

  ngOnInit(): void {}
}
