import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { map, merge, Observable, tap } from 'rxjs';
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

  getReports(): Observable<Report> {
    const lastReportDay = moment();
    const report: Report = {
      dateStart: moment(lastReportDay),
      dateEnd: moment(lastReportDay).subtract(1, 'year'),
      monthsData: [
        { month: moment(lastReportDay), data: [] }, // i = 0, current month
        { month: moment(lastReportDay).subtract(1, 'month'), data: [] }, // i = 1, previous month
        { month: moment(lastReportDay).subtract(2, 'month'), data: [] }, // i = 2, current month - 2
        { month: moment(lastReportDay).subtract(3, 'month'), data: [] }, // i = 3, current month - 3
        { month: moment(lastReportDay).subtract(4, 'month'), data: [] }, // i = 4, current month - 4
        { month: moment(lastReportDay).subtract(5, 'month'), data: [] }, // i = 5, current month - 5
        { month: moment(lastReportDay).subtract(6, 'month'), data: [] }, // i = 6, current month - 6
        { month: moment(lastReportDay).subtract(7, 'month'), data: [] }, // i = 7, current month - 7
        { month: moment(lastReportDay).subtract(8, 'month'), data: [] }, // i = 8, current month - 8
        { month: moment(lastReportDay).subtract(9, 'month'), data: [] }, // i = 9, current month - 9
        { month: moment(lastReportDay).subtract(10, 'month'), data: [] }, // i = 10, current month - 10
        { month: moment(lastReportDay).subtract(11, 'month'), data: [] }, // i = 11, current month - 11
      ],
    };

    return merge(
      this.medicamentsService
        .listCollection([this.medicamentsService.defaultOrderBy()])
        .pipe(
          map((medicaments): ReportCase[] =>
            medicaments.map((medicament): ReportCase => ({ medicament }))
          )
        ),

      this.eventsService
        .listCollection([this.eventsService.defaultOrderBy()])
        .pipe(map((events): ReportCase[] => events.map((event): ReportCase => ({ event })))),

      this.seizuresService.listCollection([this.seizuresService.defaultOrderBy()]).pipe(
        map((seizures) => this.seizuresService.convertDurations(seizures)),
        map((seizures): ReportCase[] => seizures.map((seizure): ReportCase => ({ seizure })))
      )
    ).pipe(
      map((reportCases) => {
        for (const reportCase of reportCases) {
          const caseDate = reportCaseDate(reportCase);
          const monthIndex = (moment().month() - caseDate.month()) % 12;

          if (!this.elementInReport(report, monthIndex, reportCase)) {
            report.monthsData[monthIndex].data.push(reportCase);
          }
        }

        return report;
      }),
      tap((report) => console.log(report)), // TODO remove me
      map((report) => ({
        dateStart: report.dateStart,
        dateEnd: report.dateEnd,
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
