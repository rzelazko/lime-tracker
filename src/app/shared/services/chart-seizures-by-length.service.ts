import { Injectable } from '@angular/core';
import { orderBy, where } from 'firebase/firestore';
import Moment, { Duration } from 'moment';
import { extendMoment } from 'moment-range';
import { map, Observable, take } from 'rxjs';
import { ChartData } from '../models/chart-data.model';
import { Seizure } from '../models/seizure.model';
import { ChartService } from './chart.service';
import { SeizuresService } from './seizures.service';

const moment = extendMoment(Moment as any);

@Injectable({
  providedIn: 'root',
})
export class ChartSeizuresByLengthService extends ChartService {
  constructor(private seizuresService: SeizuresService) {
    super();
  }

  seizureSerie(): Observable<ChartData> {
    return this.seizuresService
      .listCollection([
        orderBy('occurred', 'desc'),
        where('occurred', '>=', this.dateFrom.toDate()),
        where('occurred', '<=', this.dateTo.toDate()),
      ])
      .pipe(
        take(1),
        map((seizures) => this.aggregateSeizuresData(seizures))
      );
  }

  private aggregateSeizuresData(seizures: Seizure[]): ChartData {
    // We'll bucket durations in minutes: 0-1, 1-2, ..., 9-10, 10+
    const buckets = Array.from({ length: 11 }, (_, i) => ({ x: i < 10 ? `${i}-${i+1}` : '10+', y: 0 }));
    for (const seizure of seizures) {
      const durationMin = seizure.duration.asMinutes();
      const idx = durationMin >= 10 ? 10 : Math.floor(durationMin);
      buckets[idx].y++;
    }
    return { data: buckets };
  }
}
