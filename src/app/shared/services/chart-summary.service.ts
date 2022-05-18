import { Injectable } from '@angular/core';
import { orderBy, where } from 'firebase/firestore';
import * as Moment from 'moment';
import { DateRange, extendMoment } from 'moment-range';
import { map, mergeMap, Observable } from 'rxjs';
import { ChartData } from '../models/chart-data.model';
import { Event } from '../models/event.model';
import { Medication } from '../models/medication.model';
import { Seizure } from '../models/seizure.model';
import { EventsService } from './events.service';
import { MedicationsService } from './medications.service';
import { SeizuresService } from './seizures.service';

const moment = extendMoment(Moment);

interface ChartRanage<T> {
  [key: string]: T;
}
interface ChartDataRange extends ChartRanage<number> {}
interface ChartLabelsRange extends ChartRanage<string[]> {}
interface MedicationRange
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
    private medicationsService: MedicationsService,
    private eventsService: EventsService,
    private seizuresService: SeizuresService
  ) {
    this.dateTo = moment().endOf('day');
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
    this.dateTo = momentTo.endOf('day');
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

  medicationsSeries(): Observable<ChartData[]> {
    return this.medicationsService
      .listCollection([
        orderBy('startDate', 'desc'),
        where('startDate', '<=', this.dateFrom.toDate()),
      ])
      .pipe(
        mergeMap((medicationFromPreviousRange: Medication[]) =>
          this.medicationsService
            .listCollection([
              orderBy('startDate', 'desc'),
              where('startDate', '>=', this.dateFrom.toDate()),
              where('startDate', '<=', this.dateTo.toDate()),
            ])
            .pipe(map((medications) => medications.concat(...medicationFromPreviousRange)))
        ),
        map((medications) =>
          medications.filter(
            (medication) =>
              !medication.endDate || medication.endDate.isSameOrAfter(this.dateFrom.toDate())
          )
        )
      )
      .pipe(map((medications) => this.agregateMedicationsData(medications)));
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
        map((seizures) => this.agregateSeizuresData(seizures))
      );
  }

  eventsSerie(): Observable<ChartData> {
    return this.eventsService
      .listCollection([
        orderBy('occurred', 'desc'),
        where('occurred', '>=', this.dateFrom.toDate()),
        where('occurred', '<=', this.dateTo.toDate()),
      ])
      .pipe(map((events) => this.agregateEventsData(events)));
  }

  private oneYearBefore(date: moment.Moment) {
    return moment(date).add(1, 'months').subtract(1, 'year').startOf('month');
  }

  private agregateMedicationsData(medications: Medication[]): ChartData[] {
    const medicationsRange: MedicationRange = {};

    for (const medication of medications) {
      this.initRangeForMedication(medicationsRange, medication);
      this.computeRangeForMedication(medicationsRange, medication);
    }

    const result: ChartData[] = [];
    for (const medicationName in medicationsRange) {
      result.push({
        name: medicationName,
        ...this.convertToChartData(
          medicationsRange[medicationName].dataRange,
          medicationsRange[medicationName].labelsRange,
          ' - '
        ),
      });
    }

    return result;
  }

  private initRangeForMedication(medicationsRange: MedicationRange, medication: Medication) {
    let dataRange: ChartDataRange;
    let labelsRange: ChartLabelsRange;
    if (medicationsRange[medication.name]) {
      dataRange = medicationsRange[medication.name].dataRange;
      labelsRange = medicationsRange[medication.name].labelsRange;
    } else {
      dataRange = this.initializeAgregatedData();
      labelsRange = this.initializeAgregatedLabels();
      medicationsRange[medication.name] = { dataRange, labelsRange };
    }
  }

  private getMedicationRangeStart(medication: Medication, chartRange: DateRange) {
    let rangeStart = medication.startDate;
    if (!rangeStart.within(chartRange)) {
      rangeStart = this.dateFrom;
    }
    return rangeStart;
  }

  private getMedicationRangeEnd(medication: Medication, chartRange: DateRange) {
    let rangeEnd = medication.endDate || this.dateTo;
    if (rangeEnd.isAfter(this.dateTo)) {
      rangeEnd = this.dateTo;
    }
    return rangeEnd;
  }

  private computeRangeForMedication(medicationsRange: MedicationRange, medication: Medication) {
    const chartRange = moment.range(this.dateFrom, this.dateTo);
    const medicationRangeStart = this.getMedicationRangeStart(medication, chartRange);
    const medicationRangeEnd = this.getMedicationRangeEnd(medication, chartRange);
    if (medicationRangeEnd.isAfter(this.dateFrom)) {
      const dataRange = medicationsRange[medication.name].dataRange;
      const labelsRange = medicationsRange[medication.name].labelsRange;
      const medicationRange = moment
        .range(medicationRangeStart, medicationRangeEnd)
        .snapTo('month');
      for (const month of medicationRange.by('month')) {
        const monthName = month.format(this.rangeFormat);
        if (dataRange[monthName] === 0) {
          dataRange[monthName] =
            medication.doses.morning + medication.doses.noon + medication.doses.evening;

          labelsRange[monthName] = [
            medication.doses.morning.toString(),
            medication.doses.noon.toString(),
            medication.doses.evening.toString(),
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
