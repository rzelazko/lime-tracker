import { Event } from 'src/app/shared/models/event.model';
import { Injectable } from '@angular/core';
import { CrudService } from './crud.service';
import { PageData } from '../models/page-data.model';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventsService {
  constructor(private crudService: CrudService<Event>) {
    crudService.init('events', 'occurred');
  }

  create(event: Partial<Event>) {
    return this.crudService.create(event);
  }

  read(id: string) {
    return this.crudService.read(id);
  }

  update(id: string, event: Partial<Event>) {
    return this.crudService.update(id, event);
  }

  delete(id: string) {
    return this.crudService.delete(id);
  }

  listConcatenated(pageSize: number) {
    return this.crudService.listConcatenated(pageSize);
  }
}
