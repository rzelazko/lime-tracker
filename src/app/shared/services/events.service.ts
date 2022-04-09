import { Injectable } from '@angular/core';
import { Event } from '../../shared/models/event.model';
import { AuthService } from './auth.service';
import { CrudService } from './crud.service';
import { FirestoreService } from './firestore.service';

@Injectable({
  providedIn: 'root',
})
export class EventsService extends CrudService<Event> {
  constructor(authService: AuthService, firestoreService: FirestoreService) {
    super('events', 'occurred', authService, firestoreService);
  }

  override create(event: Partial<Event>) {
    return super.create(event);
  }

  override read(id: string) {
    return super.read(id);
  }

  override update(id: string, event: Partial<Event>) {
    return super.update(id, event);
  }

  override delete(id: string) {
    return super.delete(id);
  }

  override listConcatenated(pageSize: number) {
    return super.listConcatenated(pageSize);
  }
}
