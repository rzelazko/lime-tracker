import { Injectable } from '@angular/core';
import { orderBy, where } from 'firebase/firestore';
import Moment from 'moment';
import { extendMoment } from 'moment-range';
import { map, Observable } from 'rxjs';
import { Seizure } from '../models/seizure.model';
import { SeizuresService } from './seizures.service';
import { ApexAxisChartSeries } from 'ng-apexcharts'; // Import this

const moment = extendMoment(Moment as any);

@Injectable({
  providedIn: 'root',
})
export class ChartSeizuresByAmountService {
  constructor(private seizuresService: SeizuresService) {}

  // Changed return type to Observable<ApexAxisChartSeries>
  seizureSerie(by: 'month' | 'year', amount: number): Observable<ApexAxisChartSeries> {
    const dateTo = moment().endOf('day');
    let dateFrom: Moment.Moment;

    if (by === 'year') {
      dateFrom = moment()
        .subtract(amount - 1, 'years')
        .startOf('year');
    } else {
      dateFrom = moment().subtract(amount, 'years').startOf('day');
    }

    return this.seizuresService
      .listCollection([
        orderBy('occurred', 'desc'),
        where('occurred', '>=', dateFrom.toDate()),
        where('occurred', '<=', dateTo.toDate()),
      ])
      .pipe(
        map((seizures) => {
          if (by === 'year') {
            return this.aggregateSeizuresByYear(seizures, amount);
          } else {
            return this.aggregateSeizuresByMonth(seizures, amount);
          }
        })
      );
  }

  private aggregateSeizuresByYear(seizures: Seizure[], amount: number): ApexAxisChartSeries {
    const dataPoints: { x: string; y: number }[] = [];
    const currentYear = moment().year();
    for (let i = 0; i < amount; i++) {
      const year = currentYear - i;
      dataPoints.push({ x: year.toString(), y: 0 });
    }
    dataPoints.reverse(); // Ensures years are in ascending order for the chart

    for (const seizure of seizures) {
      const seizureYear = moment(seizure.occurred.toDate()).year();
      const dataPoint = dataPoints.find(dp => parseInt(dp.x) === seizureYear);
      if (dataPoint) {
        dataPoint.y++;
      }
    }
    return [{ name: $localize`:@@title-seizures:Seizures`, data: dataPoints }];
  }

  private aggregateSeizuresByMonth(seizures: Seizure[], amount: number): ApexAxisChartSeries {
    const series: ApexAxisChartSeries = [];
    const currentYear = moment().year();

    // Create a series for each of the last 'amount' years
    for (let i = 0; i < amount; i++) {
      const year = currentYear - i;
      const monthlyCounts: { x: string; y: number }[] = moment.monthsShort().map(m => ({ x: m, y: 0 }));
      series.push({
        name: year.toString(),
        data: monthlyCounts
      });
    }
    series.sort((a,b) => parseInt(a.name as string) - parseInt(b.name as string)); // Display years in ascending order (e.g., 2022, 2023, 2024)

    for (const seizure of seizures) {
      const seizureMoment = moment(seizure.occurred.toDate());
      const seizureYear = seizureMoment.year();
      const seizureMonth = seizureMoment.month(); // 0 for Jan, 1 for Feb, etc.

      // Find the correct series for the seizure's year
      const targetSeries = series.find(s => s.name === seizureYear.toString());
      // Ensure the year is within the 'amount' range and the month exists
      if (targetSeries && seizureYear >= currentYear - amount + 1 && targetSeries.data[seizureMonth]) {
        (targetSeries.data[seizureMonth] as { x: string; y: number }).y++; // Increment count for the specific month in that year
      }
    }
    return series;
  }
}