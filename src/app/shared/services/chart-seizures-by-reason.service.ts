import { Injectable } from '@angular/core';
import { orderBy, where } from 'firebase/firestore';
import { map, Observable } from 'rxjs';
import { ChartData } from '../models/chart-data.model';
import { Seizure } from '../models/seizure.model';
import { ChartService } from './chart.service';
import { SeizuresService } from './seizures.service';

@Injectable({
  providedIn: 'root',
})
export class ChartSeizuresByReasonService extends ChartService {
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
      .pipe(map((seizures) => this.aggregateSeizuresByReason(seizures)));
  }

  private aggregateSeizuresByReason(seizures: Seizure[]): ChartData {
    const reasonCounts: { [reason: string]: number } = {};
    for (const seizure of seizures) {
      if (seizure.triggers && seizure.triggers.length) {
        for (const trigger of seizure.triggers) {
          reasonCounts[trigger] = (reasonCounts[trigger] || 0) + 1;
        }
      } else {
        reasonCounts['unknown'] = (reasonCounts['unknown'] || 0) + 1;
      }
    }
    return {
      data: Object.entries(reasonCounts).map(([reason, count]) => ({ x: reason, y: count })),
      labels: Object.keys(reasonCounts),
    };
  }
}
