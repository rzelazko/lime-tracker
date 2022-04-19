import { Injectable } from '@angular/core';
import { limit, orderBy, where } from 'firebase/firestore';
import { map } from 'rxjs';
import { SeizuresService } from '../../shared/services/seizures.service';
import { MedicationsService } from './medications.service';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  constructor(
    private medicationsService: MedicationsService,
    private seizuresService: SeizuresService
  ) {}

  currentMedications() {
    return this.medicationsService.listCollection([
      orderBy('startDate', 'desc'),
      where('archived', '==', false),
    ]);
  }

  lastSeizures() {
    return this.seizuresService
      .listCollection([orderBy('occurred', 'desc'), limit(1)])
      .pipe(map((seizures) => this.seizuresService.convertDurations(seizures)));
  }
}
