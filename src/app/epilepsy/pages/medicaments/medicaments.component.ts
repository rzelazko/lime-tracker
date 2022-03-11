import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { Event } from 'src/app/shared/models/event.model';
import { Medicament } from 'src/app/shared/models/medicament.model';
import { Seizure } from 'src/app/shared/models/seizure.model';

const MOCK_MEDICAMENTS: Medicament[] = [
  {
    id: 1,
    name: 'Topamax',
    doses: { morning: 125, noon: 0, evening: 150 },
    startDate: moment('2021-09-01'),
  },
  {
    id: 2,
    name: 'Kepra',
    doses: { morning: 100, noon: 0, evening: 150 },
    startDate: moment('2021-06-01'),
  },
  {
    id: 3,
    name: 'Lamitrin',
    doses: { morning: 1500, noon: 0, evening: 1000 },
    startDate: moment('2021-06-01'),
  },
  {
    id: 4,
    name: 'Topamax',
    doses: { morning: 125, noon: 0, evening: 125 },
    startDate: moment('2021-06-01'),
  },
];

@Component({
  selector: 'app-medicaments',
  templateUrl: './medicaments.component.html',
  styleUrls: ['./medicaments.component.scss'],
})
export class MedicamentsComponent implements OnInit {
  public data: Medicament[] = MOCK_MEDICAMENTS;

  public columns = ['name', 'dose', 'startDate', 'actions'];

  constructor() {}

  ngOnInit(): void {}

  onDelete(object: Event | Medicament | Seizure) {
    console.log('Delete', object);
  }
}
