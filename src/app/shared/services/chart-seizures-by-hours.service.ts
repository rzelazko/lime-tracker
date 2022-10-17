import { Injectable } from '@angular/core';
import { orderBy, where } from 'firebase/firestore';
import * as Moment from 'moment';
import { extendMoment } from 'moment-range';
import { map, Observable, of } from 'rxjs';
import { ChartData } from '../models/chart-data.model';
import { Seizure } from '../models/seizure.model';
import { ChartService } from './chart.service';
import { SeizuresService } from './seizures.service';

const moment = extendMoment(Moment);

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
      .pipe(map((seizures) => this.agregateSeizuresData(seizures)));
  }

  private agregateSeizuresData(seizures: Seizure[]): ChartData {
    const chartData: ChartData = {
      data: []
    }

    for (const seizure of seizures) {
      const m = moment(seizure.occurred);
      const hour = +m.format('H');
      let bucket;
      if (hour >= 0 && hour < 6) {
        bucket = 0;
      } else if (hour >= 6 && hour < 12) {
        bucket = 1;
      } else if (hour >= 12 && hour < 18) {
        bucket = 2;
      } else if (hour >= 18 && hour < 24) {
        bucket = 3;
      } else {
        throw `Error: hour should be in range 0 - 23, instead it is: ${hour}`;
      }

      if (!chartData.data[bucket]) {
        chartData.data[bucket] = {x: bucket.toString(), y: 0}; // TODO x should show range like 0-6am, etc
      }

      const currentData = chartData.data[bucket];
      chartData.data[bucket] = {...currentData, y: currentData.y + 1};
    }

    return chartData;
  }
}
