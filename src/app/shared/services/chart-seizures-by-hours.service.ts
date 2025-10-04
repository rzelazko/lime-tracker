import { Injectable } from '@angular/core';
import { orderBy, where } from 'firebase/firestore';
import Moment from 'moment';
import { extendMoment } from 'moment-range';
import { map, Observable, of, take } from 'rxjs';
import { ChartData } from '../models/chart-data.model';
import { Seizure } from '../models/seizure.model';
import { ChartService } from './chart.service';
import { SeizuresService } from './seizures.service';

const moment = extendMoment(Moment as any);

@Injectable({
  providedIn: 'root',
})
export class ChartSeizuresByHoursService extends ChartService {
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
        map((seizures) => this.agregateSeizuresData(seizures))
      );
  }

  private agregateSeizuresData(seizures: Seizure[]): ChartData {
    const chartData: ChartData = { data: [] };

    for (let hour = 0; hour < 24; hour++) {
      chartData.data[hour] = { x: String(hour), y: 0 };
    }

    for (const seizure of seizures) {
      const m = moment(seizure.occurred);
      const hour = +m.format('H');

      const currentData = chartData.data[hour];
      chartData.data[hour] = { ...currentData, y: currentData.y + 1 };
    }

    return chartData;
  }
}
