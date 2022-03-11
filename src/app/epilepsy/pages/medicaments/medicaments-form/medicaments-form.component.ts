import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { Medicament } from 'src/app/shared/models/medicament.model';

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
  selector: 'app-medicaments-form',
  templateUrl: './medicaments-form.component.html',
  styleUrls: ['./medicaments-form.component.scss'],
})
export class MedicamentsFormComponent implements OnInit {
  @ViewChild('medicamentForm') medicamentForm!: NgForm;
  public updatedObject?: Medicament;

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    const id: number = +this.activatedRoute.snapshot.params['id'];
    if (id) {
      this.updatedObject = MOCK_MEDICAMENTS.filter((medicament) => medicament.id === id)[0];
    }
  }

  ngAfterViewInit() {
    Promise.resolve().then(() => {
      if (this.updatedObject) {
        this.medicamentForm.setValue({
          name: this.updatedObject.name,
          doseMorning: this.updatedObject.doses.morning,
          doseNoon: this.updatedObject.doses.noon,
          doseEvening: this.updatedObject.doses.evening,
          startDate: this.updatedObject.startDate,
        });
      }
    });
  }

  onSubmit(form: NgForm): void {
    console.log(form);
    this.router.navigate(['/epilepsy/events']);
  }
}
