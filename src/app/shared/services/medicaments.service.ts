import { Injectable } from '@angular/core';
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
    return super.create(medicament);
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
