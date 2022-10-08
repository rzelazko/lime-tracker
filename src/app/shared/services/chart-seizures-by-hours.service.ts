import { Injectable } from '@angular/core';
import * as Moment from 'moment';
import { extendMoment } from 'moment-range';
import { Observable, of } from 'rxjs';
import { ChartData } from '../models/chart-data.model';
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
    return of({ data: [] });
  }
}
