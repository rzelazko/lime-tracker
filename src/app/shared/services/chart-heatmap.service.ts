import { Injectable } from '@angular/core';
import { orderBy, where } from 'firebase/firestore';
import * as Moment from 'moment';
import { extendMoment } from 'moment-range';
import { map, Observable } from 'rxjs';
import { ChartData } from '../models/chart-data.model';
import { Seizure } from '../models/seizure.model';
import { ChartService } from './chart.service';
import { SeizuresService } from './seizures.service';

const moment = extendMoment(Moment);

@Injectable({
  providedIn: 'root',
})
export class ChartHeatmapService extends ChartService {
  constructor(private seizuresService: SeizuresService) {
    super();
  }

  seizureSerie(): Observable<ChartData[]> {
    return this.seizuresService
      .listCollection([
        orderBy('occurred', 'desc'),
        where('occurred', '>=', this.dateFrom.toDate()),
        where('occurred', '<=', this.dateTo.toDate()),
      ])
      .pipe(map((seizures) => this.agregateSeizuresData(seizures)));
  }

  private agregateSeizuresData(seizures: Seizure[]): ChartData[] {
    const chartData: ChartData[] = [];
    const firstDayOfYearInRange = +moment(this.dateFrom).format('DDD');
    const totalDaysInRange = this.dateTo.diff(this.dateFrom, 'days') + 1;
    let amountOfSeries;
    if (totalDaysInRange % 5 === 0) {
      amountOfSeries = 5;
    } else if (totalDaysInRange % 6 === 0) {
      amountOfSeries = 6;
    } else {
      throw `Error: range is supposed to have 365 or 366 days, instead it had ${totalDaysInRange}`;
    }
    const daysPerSerie = Math.floor(totalDaysInRange / amountOfSeries);

    for (var m = moment(this.dateFrom); m.isSameOrBefore(this.dateTo); m.add(1, 'day')) {
      const reindexedDayOfYear = this.getRemappedDayOfYear(
        m,
        firstDayOfYearInRange,
        totalDaysInRange
      );

      const rowIndex = reindexedDayOfYear % daysPerSerie;
      const serieIndex = Math.floor(reindexedDayOfYear / daysPerSerie);

      if (!chartData[serieIndex]) {
        chartData[serieIndex] = {
          data: [],
          name: '',
        };
      }

      const formattedDate = m.format('LL');
      chartData[serieIndex].data.push({ x: rowIndex.toString(), y: 0, label: formattedDate });
    }

    for (const seizure of seizures) {
      const m = moment(seizure.occurred);
      const reindexedDayOfYear = this.getRemappedDayOfYear(
        m,
        firstDayOfYearInRange,
        totalDaysInRange
      );

      const rowIndex = reindexedDayOfYear % daysPerSerie;
      const serieIndex = Math.floor(reindexedDayOfYear / daysPerSerie);

      const currentDataIndex = chartData[serieIndex].data.findIndex(
        (data) => data.x === rowIndex.toString()
      );
      if (currentDataIndex > -1) {
        const currentData = chartData[serieIndex].data[currentDataIndex];
        chartData[serieIndex].data[currentDataIndex] = { ...currentData, y: currentData.y + 1 };
      } else {
        throw 'Error: data should have been initialized at this point';
      }
    }

    return chartData;
  }

  private getRemappedDayOfYear(
    m: moment.Moment,
    firstDayOfYearInRange: number,
    totalDaysInRange: number
  ): number {
    const dayOfYear = +m.format('DDD');
    let reindexedDayOfYear; // dayOfYear indexed in a way that first day in range has index = 0, last day in range has index = 365
    if (dayOfYear >= firstDayOfYearInRange) {
      reindexedDayOfYear = dayOfYear - firstDayOfYearInRange;
    } else {
      reindexedDayOfYear = totalDaysInRange - firstDayOfYearInRange + dayOfYear;
    }

    return reindexedDayOfYear;
  }
}
