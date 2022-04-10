import { Injectable } from '@angular/core';
import { orderBy, where } from 'firebase/firestore';
import * as moment from 'moment';
import { map, merge, Observable } from 'rxjs';
import { Report, ReportCase, reportCaseDate } from '../models/report.model';
import { EventsService } from './events.service';
import { MedicamentsService } from './medicaments.service';
import { SeizuresService } from './seizures.service';

@Injectable({
  providedIn: 'root',
})
export class ReportsService {
  constructor(
    private medicamentsService: MedicamentsService,
    private eventsService: EventsService,
    private seizuresService: SeizuresService
  ) {}

  getReports(year?: number): Observable<Report> {
    const lastReportDay = year ? moment().year(year).endOf('year') : moment();
    lastReportDay.hours(0).minutes(0).seconds(0).milliseconds(0);
    const report: Report = {
      dateTo: moment(lastReportDay),
      dateFrom: moment(lastReportDay).endOf('month').subtract(1, 'year').add(1, 'day').startOf('month'),
      monthsData: [
        { month: moment(lastReportDay).startOf('month'), data: [] }, // `monthIndex` = `0` <- current month
      ],
    };

    /**
     * `monthIndex` is index of `report.monthsData` array
     * `monthIndex` = `0` <- current month
     * `monthIndex` = `1` <- current month - 1 (previous month)
     * `monthIndex` = `2` <- current month - 2
     * etc
     *
     * It is used to add Seizure, Medicament & Event to valid montly report without iterating through array to find a place.
     *
     * Instead we can compute place in the montly array by:
     *
     * ```
     * (dateTo.month + 12 - seizure/event/medicament.month) % 12
     * ```
     *
     */
    let monthIndex = 1;
    while (
      report.monthsData[report.monthsData.length - 1].month.isAfter(report.dateFrom)
    ) {
      // Fill `report.monthData` with placeholders,
      // until whole range of dates from `report.dateFrom` has been covered
      report.monthsData.push({
        month: moment(lastReportDay).subtract(monthIndex, 'month').startOf('month'),
        data: [],
      });
      monthIndex++;
    }

    return merge(
      this.medicamentsService
        .listCollection([
          orderBy('startDate', 'desc'),
          where('startDate', '>=', report.dateFrom.toDate()),
          where('startDate', '<=', report.dateTo.toDate()),
        ])
        .pipe(
          map((medicaments): ReportCase[] =>
            medicaments.map((medicament): ReportCase => ({ medicament }))
          )
        ),

      this.eventsService
        .listCollection([
          orderBy('occurred', 'desc'),
          where('occurred', '>=', report.dateFrom.toDate()),
          where('occurred', '<=', report.dateTo.toDate()),
        ])
        .pipe(map((events): ReportCase[] => events.map((event): ReportCase => ({ event })))),

      this.seizuresService
        .listCollection([
          orderBy('occurred', 'desc'),
          where('occurred', '>=', report.dateFrom.toDate()),
          where('occurred', '<=', report.dateTo.toDate()),
        ])
        .pipe(
          map((seizures) => this.seizuresService.convertDurations(seizures)),
          map((seizures): ReportCase[] => seizures.map((seizure): ReportCase => ({ seizure })))
        )
    ).pipe(
      map((reportCases) => {
        for (const reportCase of reportCases) {
          const caseDate = reportCaseDate(reportCase);
          if (caseDate.isBetween(report.dateFrom, report.dateTo, undefined, "[]")) {
            const monthIndex = (report.dateTo.month() + 12 - caseDate.month()) % 12;

            if (!this.elementInReport(report, monthIndex, reportCase)) {
              report.monthsData[monthIndex].data.push(reportCase);
            }
          } else {
            // should be impossible: backed with firebase where condition
            throw `Report case ${caseDate.format()} not in range ${report.dateFrom.format()} - ${report.dateTo.format()}`;
          }
        }

        return report;
      }),
      map((report) => ({
        dateFrom: report.dateFrom,
        dateTo: report.dateTo,
        monthsData: report.monthsData.map((monthData) => ({
          month: monthData.month,
          data: monthData.data.sort(
            (a: ReportCase, b: ReportCase) =>
              reportCaseDate(b).valueOf() - reportCaseDate(a).valueOf()
          ),
        })),
      }))
    );
  }

  private elementInReport(report: Report, month: number, element: ReportCase) {
    return report.monthsData[month].data.some(
      (data) =>
        (data.medicament && element.medicament && data.medicament.id === element.medicament.id) ||
        (data.event && element.event && data.event.id === element.event.id) ||
        (data.seizure && element.seizure && data.seizure.id === element.seizure.id)
    );
  }
}
