import { Injectable } from '@angular/core';
import { Event, EventInternal } from '../../shared/models/event.model';
import { AuthService } from './auth.service';
import { CrudService } from './crud.service';
import { FirestoreService } from './firestore.service';

@Injectable({
  providedIn: 'root',
})
export class EventsService extends CrudService<EventInternal, Event> {
  constructor(authService: AuthService, firestoreService: FirestoreService) {
    super('events', 'occurred', authService, firestoreService);
  }

  protected convertToInternal(data: Partial<Event>): Partial<EventInternal> {
    const {objectType, ...internalEvent} = data;
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
