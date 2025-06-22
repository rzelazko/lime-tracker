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
export class ChartSeizuresByTypeService extends ChartService {
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
      .pipe(map((seizures) => this.aggregateSeizuresByType(seizures)));
  }

  private aggregateSeizuresByType(seizures: Seizure[]): ChartData {
    const typeCounts: { [type: string]: number } = {};
    for (const seizure of seizures) {
      typeCounts[seizure.type] = (typeCounts[seizure.type] || 0) + 1;
    }
    return {
      data: Object.entries(typeCounts).map(([type, count]) => ({ x: type, y: count })),
      labels: Object.keys(typeCounts),
    };
  }
}
