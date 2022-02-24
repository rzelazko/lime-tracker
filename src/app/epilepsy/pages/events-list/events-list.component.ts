import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { Event } from 'src/app/shared/event.model';

@Component({
  selector: 'app-events-list',
  templateUrl: './events-list.component.html',
  styleUrls: ['./events-list.component.scss'],
})
export class EventsListComponent implements OnInit {
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
