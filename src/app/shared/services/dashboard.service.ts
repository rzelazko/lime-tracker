import { inject, Injectable } from '@angular/core';
import { limit, orderBy, where } from 'firebase/firestore';
import { EventsService } from './events.service';
import { MedicationsService } from './medications.service';
import { PeriodsService } from './periods.service';
import { SeizuresService } from './seizures.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private medicationsService: MedicationsService = inject(MedicationsService);
  private seizuresService: SeizuresService = inject(SeizuresService);
  private eventsService: EventsService = inject(EventsService);
  private periodsService: PeriodsService = inject(PeriodsService);

  currentMedications() {
    return this.medicationsService.listCollection([
      orderBy('startDate', 'desc'),
      where('archived', '==', false)
    ]);
  }

  lastSeizures() {
    return this.seizuresService.listCollection([orderBy('occurred', 'desc'), limit(1)]);
  }

  lastEvents() {
    return this.eventsService.listCollection([orderBy('occurred', 'desc'), limit(3)]);
  }

  lastPeriods() {
    return this.periodsService.listCollection([orderBy('startDate', 'desc'), limit(1)]);
  }
}
