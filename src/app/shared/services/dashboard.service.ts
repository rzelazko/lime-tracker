import { SeizuresService } from 'src/app/shared/services/seizures.service';
import { Medicament } from './../models/medicament.model';
import { Injectable } from '@angular/core';
import { limit, orderBy, where } from 'firebase/firestore';
import { map, tap } from 'rxjs';
import { MedicamentsService } from './medicaments.service';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  constructor(
    private medicamentsService: MedicamentsService,
    private seizuresService: SeizuresService
  ) {}

  currentMedicaments() {
    return this.medicamentsService.listCollection([orderBy('startDate', 'desc')]).pipe(
      map((medicaments) => {
        const uniqueMedicamentsOnly: Medicament[] = [];
        for (const medicament of medicaments) {
          const newerInMedicamentList = uniqueMedicamentsOnly.some(
            (uniqueMedicament) => uniqueMedicament.name === medicament.name
          );
          if (!newerInMedicamentList) {
            // TODO use some kind of flag instead
            uniqueMedicamentsOnly.push(medicament);
          }
        }

        return uniqueMedicamentsOnly;
      })
    );
  }

  lastSeizure() {
    return this.seizuresService.listCollection([orderBy('occurred', 'desc'), limit(1)]).pipe(
      map((seizures) => this.seizuresService.convertDurations(seizures))
    );
  }
}
