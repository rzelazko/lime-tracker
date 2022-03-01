import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { Duration } from 'moment';
import { Seizure } from 'src/app/shared/seizure.model';

const MOCK_SEIZURE_TYPES: String[] = [
  'Type A',
  'Type B',
  'Type C',
  'Type D',
  'Type E',
  'Type F',
];

const MOCK_SEIZURE_TRIGGERS: String[] = [
  'Lights',
  'Period',
  'Forgotten medicament',
  ''
];

const MOCK_SEIZURES: Seizure[] = [
  {
    id: 1,
    occurred: moment('2021-12-24T14:24:00'),
    type: 'Type F',
    duration: moment.duration(4, 'minutes'),
    trigger: 'Lights',
  },
  {
    id: 2,
    occurred: moment('2021-12-22T14:24:00'),
    type: 'Type D',
    duration: moment.duration(6, 'minutes'),
  },
  {
    id: 3,
    occurred: moment('2021-12-15T14:24:00'),
    type: 'Type A',
    duration: moment.duration(2, 'minutes'),
  },
  {
    id: 4,
    occurred: moment('2021-12-10T14:24:00'),
    type: 'Type B',
    duration: moment.duration(1, 'minutes'),
    trigger: 'Lights',
  },
  {
    id: 5,
    occurred: moment('2021-12-05T14:24:00'),
    type: 'Type A',
    duration: moment.duration(3, 'minutes'),
    trigger: 'Period',
  },
  {
    id: 6,
    occurred: moment('2021-09-30T11:24:00'),
    type: 'Type A',
    duration: moment.duration(5, 'minutes'),
  },
  {
    id: 7,
    occurred: moment('2021-09-27T19:24:00'),
    type: 'Type B',
    duration: moment.duration(8, 'minutes'),
  },
  {
    id: 8,
    occurred: moment('2021-09-17T19:24:00'),
    type: 'Type C',
    duration: moment.duration(12, 'minutes'),
  },
  {
    id: 9,
    occurred: moment('2021-09-02T19:24:00'),
    type: 'Type B',
    duration: moment.duration(34, 'minutes'),
    trigger: 'Forgotten medicament'
  },
];

@Component({
  selector: 'app-seizures-form',
  templateUrl: './seizures-form.component.html',
  styleUrls: ['./seizures-form.component.scss'],
})
export class SeizuresFormComponent implements OnInit {
  @ViewChild('seizureForm') seizureForm!: NgForm;
  public updatedObject?: Seizure;
  public seizureTypes = MOCK_SEIZURE_TYPES;
  public seizureTriggers = MOCK_SEIZURE_TRIGGERS;
  public d:Duration = moment.duration(1);

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    const id: number = +this.activatedRoute.snapshot.params['id'];
    if (id) {
      this.updatedObject = MOCK_SEIZURES.filter((seizure) => seizure.id === id)[0];
    }
  }

  ngAfterViewInit() {
    Promise.resolve().then(() => {
      if (this.updatedObject) {
        this.seizureForm.setValue({
          occurredDate: this.updatedObject.occurred,
          occurredTime: this.updatedObject.occurred.format("hh:mm"),
          seizureType: this.updatedObject.type,
          seizureTrigger: this.updatedObject.trigger,
          duration: this.updatedObject.duration.minutes()
        });
      }
    });
  }

  onSubmit(form: NgForm): void {
    console.log(form); // TODO use reactive form to get duration value
    this.router.navigate(['/epilepsy/seizures']);
  }
}
