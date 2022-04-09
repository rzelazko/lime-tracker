import { Injectable } from '@angular/core';
import { orderBy, where } from 'firebase/firestore';
import * as moment from 'moment';
import {
  mergeMap, take, tap
} from 'rxjs';
import { Medicament } from '../../shared/models/medicament.model';
import { AuthService } from './auth.service';
import { CrudService } from './crud.service';
import { FirestoreService } from './firestore.service';

@Injectable({
  providedIn: 'root',
})
export class MedicamentsService extends CrudService<Medicament> {
  constructor(authService: AuthService, firestoreService: FirestoreService) {
    super('medicaments', 'startDate', authService, firestoreService);
  }

  override create(medicament: Partial<Medicament>) {
    return this.listCollection([
      orderBy('startDate', 'desc'),
      where('startDate', '<', medicament.startDate?.toDate()),
      where('name', '==', medicament.name),
      where('archived', '==', false),
    ]).pipe(
      take(1),
      mergeMap((medicamentsToUpdate: Medicament[]) => {
        this.firestoreService.startTransaction();
        for (const medicamentToUpdate of medicamentsToUpdate) {
          this.firestoreService.appendUpdateToTransaction(
            `${this.collectionPath()}/${medicamentToUpdate.id}`,
            { archived: true, endDate: moment(medicament.startDate).subtract(1, 'day') }
          );
        }
        this.firestoreService.appendAddToTransaction(this.collectionPath(), medicament);
        return this.firestoreService.commitTransaction();
      }),
      tap(() => this.resetConcatenated())
    );
  }

  override read(id: string) {
    return super.read(id);
  }

  override update(id: string, medicament: Partial<Medicament>) {
    return super.update(id, medicament);
  }

  override delete(id: string) {
    return super.delete(id);
  }

  override listConcatenated(pageSize: number) {
    return super.listConcatenated(pageSize);
  }
}
