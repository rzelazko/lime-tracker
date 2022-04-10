import { Injectable } from '@angular/core';
import { limit, orderBy, where } from 'firebase/firestore';
import * as Moment from 'moment';
import { DateRange, extendMoment } from 'moment-range';
import { map, mergeMap, Observable, take } from 'rxjs';
import { ChartData } from '../models/chart-data.model';
import { Event } from '../models/event.model';
import { Medicament } from '../models/medicament.model';
import { Seizure } from '../models/seizure.model';
import { EventsService } from './events.service';
import { MedicamentsService } from './medicaments.service';
import { SeizuresService } from './seizures.service';

const moment = extendMoment(Moment);

interface ChartRanage<T> {
  [key: string]: T;
}
interface ChartDataRange extends ChartRanage<number> {}
interface ChartLabelsRange extends ChartRanage<string[]> {}
interface MedicamentRange
  extends ChartRanage<{
    dataRange: ChartDataRange;
    labelsRange: ChartLabelsRange;
  }> {}

@Injectable({
  providedIn: 'root',
})
export class ChartSummaryService {
  private static readonly DEFAULT_RANGE_FORMAT = 'MM/YY';
  private dateTo: moment.Moment;
  private dateFrom: moment.Moment;

  constructor(
    private medicamentsService: MedicamentsService,
    private eventsService: EventsService,
    private seizuresService: SeizuresService
  ) {
    this.dateTo = moment().hours(0).minutes(0).seconds(0).milliseconds(0);
    this.dateFrom = this.oneYearBefore(this.dateTo);
  }

  get rangeFormat() {
    if (this.dateFrom.year() === this.dateTo.year()) {
      return 'MMM';
    } else {
      return ChartSummaryService.DEFAULT_RANGE_FORMAT;
    }
  }

  setYear(year?: number) {
    const momentTo = moment();
    if (year) {
      momentTo.year(year).endOf('year');
    }
    this.dateTo = momentTo.hours(0).minutes(0).seconds(0).milliseconds(0);
    this.dateFrom = this.oneYearBefore(this.dateTo);
  }

  subtitle(): string {
    let subtitle;
    if (this.dateFrom.year() === this.dateTo.year()) {
      subtitle = `${this.dateFrom.format('MMM')} - ${this.dateTo.format('MMM')}`;
      subtitle += ` ${this.dateTo.year()}`;
    } else {
      subtitle = `${this.dateFrom.format('MMM YYYY')} - ${this.dateTo.format('MMM YYYY')}`;
    }
    return subtitle;
  }

  medicamentSeries(): Observable<ChartData[]> {
    return this.medicamentsService
      .listCollection([
        orderBy('startDate', 'desc'),
        where('startDate', '<=', this.dateFrom.toDate()),
        limit(1),
      ])
      .pipe(
        mergeMap((medicamentFromPreviousRange: Medicament[]) =>
          this.medicamentsService
            .listCollection([
              orderBy('startDate', 'desc'),
              where('startDate', '>=', this.dateFrom.toDate()),
              where('startDate', '<=', this.dateTo.toDate()),
            ])
            .pipe(
              map((medicaments) =>
                medicamentFromPreviousRange.length
                  ? [...medicaments, medicamentFromPreviousRange[0]]
                  : medicaments
              )
            )
        )
      )
      .pipe(
        map((medicaments) => this.agregateMedicamentsData(medicaments)),
        take(1)
      );
  }

  seizureSerie(): Observable<ChartData> {
    return this.seizuresService
      .listCollection([
        orderBy('occurred', 'desc'),
        where('occurred', '>=', this.dateFrom.toDate()),
        where('occurred', '<=', this.dateTo.toDate()),
      ])
      .pipe(
        map((seizures) => this.seizuresService.convertDurations(seizures)),
        map((seizures) => this.agregateSeizuresData(seizures)),
        take(1)
      );
  }

  eventsSerie(): Observable<ChartData> {
    return this.eventsService
      .listCollection([
        orderBy('occurred', 'desc'),
        where('occurred', '>=', this.dateFrom.toDate()),
        where('occurred', '<=', this.dateTo.toDate()),
      ])
      .pipe(
        map((events) => this.agregateEventsData(events)),
        take(1)
      );
  }

  private oneYearBefore(date: moment.Moment) {
    return moment(date).endOf('month').subtract(1, 'year').add(1, 'day').startOf('month');
  }

  private agregateMedicamentsData(medicaments: Medicament[]): ChartData[] {
    const medicamentsRange: MedicamentRange = {};

    for (const medicament of medicaments) {
      this.initRangeForMedicament(medicamentsRange, medicament);
      this.computeRangeForMedicament(medicamentsRange, medicament);
    }

    const result: ChartData[] = [];
    for (const medicamentName in medicamentsRange) {
      result.push({
        name: medicamentName,
        ...this.convertToChartData(
          medicamentsRange[medicamentName].dataRange,
          medicamentsRange[medicamentName].labelsRange,
          ' - '
        ),
      });
    }

    return result;
  }

  private initRangeForMedicament(medicamentsRange: MedicamentRange, medicament: Medicament) {
    let dataRange: ChartDataRange;
    let labelsRange: ChartLabelsRange;
    if (medicamentsRange[medicament.name]) {
      dataRange = medicamentsRange[medicament.name].dataRange;
      labelsRange = medicamentsRange[medicament.name].labelsRange;
    } else {
      dataRange = this.initializeAgregatedData();
      labelsRange = this.initializeAgregatedLabels();
      medicamentsRange[medicament.name] = { dataRange, labelsRange };
    }
  }

  private getMedicamentRangeStart(medicament: Medicament, chartRange: DateRange) {
    let medicamentRangeStart = medicament.startDate;
    if (!medicamentRangeStart.within(chartRange)) {
      medicamentRangeStart = this.dateFrom;
    }
    return medicamentRangeStart;
  }

  private getMedicamentRangeEnd(medicament: Medicament, chartRange: DateRange) {
    let medicamentRangeEnd = medicament.endDate || this.dateTo;
    if (medicamentRangeEnd.isAfter(this.dateTo)) {
      medicamentRangeEnd = this.dateTo;
    }
    return medicamentRangeEnd;
  }

  private computeRangeForMedicament(medicamentsRange: MedicamentRange, medicament: Medicament) {
    const chartRange = moment.range(this.dateFrom, this.dateTo);
    const medicamentRangeStart = this.getMedicamentRangeStart(medicament, chartRange);
    const medicamentRangeEnd = this.getMedicamentRangeEnd(medicament, chartRange);
    if (medicamentRangeEnd.isAfter(this.dateFrom)) {
      const dataRange = medicamentsRange[medicament.name].dataRange;
      const labelsRange = medicamentsRange[medicament.name].labelsRange;
      const medicamentRange = moment
        .range(medicamentRangeStart, medicamentRangeEnd)
        .snapTo('month');
      for (const month of medicamentRange.by('month')) {
        const monthName = month.format(this.rangeFormat);
        if (dataRange[monthName] === 0) {
          dataRange[monthName] =
            medicament.doses.morning + medicament.doses.noon + medicament.doses.evening;

          labelsRange[monthName] = [
            medicament.doses.morning.toString(),
            medicament.doses.noon.toString(),
            medicament.doses.evening.toString(),
          ];
        }
      }
    }
  }

  private agregateSeizuresData(seizures: Seizure[]): ChartData {
    const dataRange = this.initializeAgregatedData();

    for (const seizure of seizures) {
      dataRange[seizure.occurred.format(this.rangeFormat)]++;
    }

    return this.convertToChartData(dataRange);
  }

  private agregateEventsData(events: Event[]): ChartData {
    const labelsRange = this.initializeAgregatedLabels();
    const dataRange = this.initializeAgregatedData();

    for (const event of events) {
      dataRange[event.occurred.format(this.rangeFormat)]++;
      labelsRange[event.occurred.format(this.rangeFormat)].push(event.name);
    }

    return this.convertToChartData(dataRange, labelsRange, ', ', -1);
  }

  private initializeAgregatedData() {
    const dataRange: ChartRanage<number> = {};
    const range = moment.range(this.dateFrom, this.dateTo).snapTo('month');
    for (let month of range.by('month')) {
      dataRange[month.format(this.rangeFormat)] = 0;
    }

    return dataRange;
  }

  private initializeAgregatedLabels() {
    const dataRange: ChartRanage<string[]> = {};
    const range = moment.range(this.dateFrom, this.dateTo).snapTo('month');
    for (let month of range.by('month')) {
      dataRange[month.format(this.rangeFormat)] = [];
    }

    return dataRange;
  }

  private convertToChartData(
    dataRange: ChartDataRange,
    labelsRange?: ChartLabelsRange,
    labelsSeparator?: string,
    dataDefault?: number
  ) {
    const result: ChartData = { data: [] };
    if (labelsRange) {
      result.labels = [];
    }
    for (let month in dataRange) {
      let y = dataRange[month];
      if (dataDefault) {
        y = y > 0 ? y : -1;
      }
      result.data.push({ x: month, y });
      if (labelsRange) {
        result.labels?.push(labelsRange[month].join(labelsSeparator || ' '));
      }
    }

    return result;
  }
}
