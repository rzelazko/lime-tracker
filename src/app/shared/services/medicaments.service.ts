import { Medicament } from 'src/app/shared/models/medicament.model';
import { Injectable } from '@angular/core';
import { CrudService } from './crud.service';
import { PageData } from '../models/page-data.model';
import { map } from 'rxjs';
import { AuthService } from './auth.service';
import { FirestoreService } from './firestore.service';

@Injectable({
  providedIn: 'root'
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
