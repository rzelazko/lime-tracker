import { Medicament } from 'src/app/shared/models/medicament.model';
import { Injectable } from '@angular/core';
import { CrudService } from './crud.service';
import { PageData } from '../models/page-data.model';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MedicamentsService {
  constructor(private crudService: CrudService<Medicament>) {
    crudService.init('medicaments', 'startDate');
  }

  create(medicament: Partial<Medicament>) {
    return this.crudService.create(medicament);
  }

  read(id: string) {
    return this.crudService.read(id);
  }

  update(id: string, medicament: Partial<Medicament>) {
    return this.crudService.update(id, medicament);
  }

  delete(id: string) {
    return this.crudService.delete(id);
  }

  listConcatenated(pageSize: number) {
    return this.crudService.listConcatenated(pageSize);
  }
}
