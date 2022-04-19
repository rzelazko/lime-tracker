import { Injectable } from '@angular/core';
import { orderBy, where } from 'firebase/firestore';
import * as moment from 'moment';
import {
  mergeMap, take, tap
} from 'rxjs';
import { Medication } from '../models/medication.model';
import { AuthService } from './auth.service';
import { CrudService } from './crud.service';
import { FirestoreService } from './firestore.service';

@Injectable({
  providedIn: 'root',
})
export class MedicationsService extends CrudService<Medication> {
  constructor(authService: AuthService, firestoreService: FirestoreService) {
    super('medications', 'startDate', authService, firestoreService);
  }

  override create(medication: Partial<Medication>) {
    return this.listCollection([
      orderBy('startDate', 'desc'),
      where('startDate', '<', medication.startDate?.toDate()),
      where('name', '==', medication.name),
      where('archived', '==', false),
    ]).pipe(
      take(1),
      mergeMap((medicationsToUpdate: Medication[]) => {
        this.firestoreService.startTransaction();
        for (const medicationToUpdate of medicationsToUpdate) {
          this.firestoreService.appendUpdateToTransaction(
            `${this.collectionPath()}/${medicationToUpdate.id}`,
            { archived: true, endDate: moment(medication.startDate).subtract(1, 'day') }
          );
        }
        this.firestoreService.appendAddToTransaction(this.collectionPath(), medication);
        return this.firestoreService.commitTransaction();
      }),
      tap(() => this.resetConcatenated())
    );
  }

  override read(id: string) {
    return super.read(id);
  }

  override update(id: string, medication: Partial<Medication>) {
    return super.update(id, medication);
  }

  override delete(id: string) {
    return super.delete(id);
  }

  override listConcatenated(pageSize: number) {
    return super.listConcatenated(pageSize);
  }
}
