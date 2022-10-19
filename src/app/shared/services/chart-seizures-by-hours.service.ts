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
      data: [
        {x: $localize`:@@chart-seizures-by-hours-x-0-6:0 - 6 AM`, y: 0},
        {x: $localize`:@@chart-seizures-by-hours-x-6-12:6 - 12 AM`, y: 0},
        {x: $localize`:@@chart-seizures-by-hours-x-12-18:12 - 6 PM`, y: 0},
        {x: $localize`:@@chart-seizures-by-hours-x-18-0:6 - 12 PM`, y: 0}
      ]
    }

    for (const seizure of seizures) {
      const m = moment(seizure.occurred);
      const hour = +m.format('H');
      const bucket = Math.floor(hour / 6);

      const currentData = chartData.data[bucket];
      chartData.data[bucket] = {...currentData, y: currentData.y + 1};
    }

    return chartData;
  }
}
