import { Injectable } from '@angular/core';
import { orderBy, where } from 'firebase/firestore';
import moment from 'moment';
import { mergeMap, switchMap, take, tap } from 'rxjs';
import { Medication, MedicationInternal } from './../models/medication.model';
import { CrudService } from './crud.service';

@Injectable({
  providedIn: 'root'
})
export class MedicationsService extends CrudService<MedicationInternal, Medication> {
  constructor() {
    super('medications', 'startDate');
  }

  override create(medication: Partial<Medication>) {
    return this.listCollection([
      orderBy('startDate', 'desc'),
      where('startDate', '<', medication.startDate?.toDate()),
      where('name', '==', medication.name),
      where('archived', '==', false)
    ]).pipe(
      take(1),
      mergeMap((medicationsToUpdate: Medication[]) => {
        return this.collectionPath().pipe(
          switchMap((path) => {
            this.firestoreService.startTransaction();
            for (const medicationToUpdate of medicationsToUpdate) {
              this.firestoreService.appendUpdateToTransaction(
                `${path}/${medicationToUpdate.id}`,
                this.convertToInternal({
                  archived: true,
                  endDate: moment(medication.startDate).subtract(1, 'day')
                })
              );
            }
            this.firestoreService.appendAddToTransaction(path, this.convertToInternal(medication));
            return this.firestoreService.commitTransaction();
          })
        );
      }),
      tap(() => this.resetConcatenated())
    );
  }

  override convertFromInternal(data: MedicationInternal): Medication {
    return {
      objectType: 'MEDICATION',
      ...data
    };
  }

  override convertToInternal(data: Partial<Medication>): Partial<MedicationInternal> {
    const { objectType, ...internalMedication } = data;
    return {
      ...internalMedication
    };
  }
}
