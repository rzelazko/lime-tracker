import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { Medicament } from '../../../shared/medicament.model';

@Component({
  selector: 'app-medicaments',
  templateUrl: './medicaments.component.html',
  styleUrls: ['./medicaments.component.scss'],
})
export class MedicamentsComponent implements OnInit {
  public data: Medicament[] = [
    {
      name: 'Topamax',
      doses: { morning: 125, noon: 0, evening: 150 },
      startDate: moment('2021-09-01'),
    },
    {
      name: 'Kepra',
      doses: { morning: 100, noon: 0, evening: 150 },
      startDate: moment('2021-06-01'),
    },
    {
      name: 'Lamitrin',
      doses: { morning: 1500, noon: 0, evening: 1000 },
      startDate: moment('2021-06-01'),
    },
    {
      name: 'Topamax',
      doses: { morning: 125, noon: 0, evening: 125 },
      startDate: moment('2021-06-01'),
    },
  ];

  public columns = [
    'name', 'dose', 'startDate', 'actions'
  ];

  constructor() {}

  ngOnInit(): void {}
}
