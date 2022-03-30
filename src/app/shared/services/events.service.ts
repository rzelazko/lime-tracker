import { Event } from 'src/app/shared/models/event.model';
import { Injectable } from '@angular/core';
import { CrudService } from './crud.service';
import { PageData } from '../models/page-data.model';
import { map } from 'rxjs';
import { AuthService } from './auth.service';
import { FirestoreService } from './firestore.service';

@Injectable({
  providedIn: 'root'
})
export class EventsService extends CrudService<Event> {
  constructor(authService: AuthService, firestoreService: FirestoreService) {
    super(authService, firestoreService);
    this.init('events', 'occurred');
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
