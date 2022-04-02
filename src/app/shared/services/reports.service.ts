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

  getReports(year?: number): Observable<Report> {
    const report: Report = {
      year: year || moment().year(),
      monthsData: [
        [], // Jan
        [], // Feb
        [], // Mar
        [], // Apr
        [], // May
        [], // Jun
        [], // Jul
        [], // Aug
        [], // Sep
        [], // Oct
        [], // Nov
        [], // Dec
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

          if (!this.elementInReport(report, caseDate.month(), reportCase)) {
            report.monthsData[caseDate.month()].push(reportCase);
          }
        }

        return report;
      }),
      map((report) => ({
        year: report.year,
        monthsData: report.monthsData.map((monthData) =>
          monthData.sort(
            (a: ReportCase, b: ReportCase) =>
              reportCaseDate(b).valueOf() - reportCaseDate(a).valueOf()
          )
        ),
      })),
      tap((report) => console.log(report)) // TODO remove me
    );
  }

  private elementInReport(report: Report, month: number, element: ReportCase) {
    return report.monthsData[month].some(
      (data) =>
        (data.medicament && element.medicament && data.medicament.id === element.medicament.id) ||
        (data.event && element.event && data.event.id === element.event.id) ||
        (data.seizure && element.seizure && data.seizure.id === element.seizure.id)
    );
  }
}
