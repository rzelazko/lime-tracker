import { Injectable } from '@angular/core';
import { Event, EventInternal } from './../../shared/models/event.model';
import { CrudService } from './crud.service';

@Injectable({
  providedIn: 'root'
})
export class EventsService extends CrudService<EventInternal, Event> {
  constructor() {
    super('events', 'occurred');
  }

  protected convertToInternal(data: Partial<Event>): Partial<EventInternal> {
    const { objectType, ...internalEvent } = data;
    return {
      ...internalEvent
    };
  }

  protected convertFromInternal(data: EventInternal): Event {
    return {
      objectType: 'EVENT',
      ...data
    };
  }
}
