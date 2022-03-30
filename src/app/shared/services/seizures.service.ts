import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { map } from 'rxjs';
import { PageData } from '../models/page-data.model';
import { Seizure } from '../models/seizure.model';
import { CrudService } from './crud.service';

@Injectable({
  providedIn: 'root',
})
export class SeizuresService {
  constructor(private crudService: CrudService<Seizure>) {
    crudService.init('seizures', 'occurred');
  }

  create(seizure: Partial<Seizure>) {
    return this.crudService.create(seizure);
  }

  read(id: string) {
    return this.crudService.read(id).pipe(map((data) => this.convertDuration(data)));
  }

  update(id: string, seizure: Partial<Seizure>) {
    return this.crudService.update(id, seizure);
  }

  delete(id: string) {
    return this.crudService.delete(id).pipe(
      map(
        (pageData): PageData<Seizure> => ({
          hasMore: pageData.hasMore,
          data: this.convertDurations(pageData.data),
        })
      )
    );
  }

  listConcatenated(pageSize: number) {
    return this.crudService.listConcatenated(pageSize).pipe(
      map(
        (pageData): PageData<Seizure> => ({
          hasMore: pageData.hasMore,
          data: this.convertDurations(pageData.data),
        })
      )
    );
  }

  private convertDurations(data: Seizure[]) {
    return data.map((seizure) => this.convertDuration(seizure));
  }

  private convertDuration(data: Seizure) {
    return {
      ...data,
      duration: moment.duration(data.duration, 'minutes'),
    };
  }
}
