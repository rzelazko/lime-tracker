import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { Event } from '../../../../shared/models/event.model';

const MOCK_EVENTS: Event[] = [
  { id: "1", name: 'A lot of stress', occurred: moment('2021-04-12T04:00:00') },
  { id: "2", name: 'Start taking CBD oil', occurred: moment('2021-11-17T14:24:00') },
];

@Component({
  selector: 'app-events-form',
  templateUrl: './events-form.component.html',
  styleUrls: ['./events-form.component.scss'],
})
export class EventsFormComponent implements OnInit, AfterViewInit {
  @ViewChild('eventForm') eventForm!: NgForm;
  public updatedObject?: Event;

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    const id: string = this.activatedRoute.snapshot.params['id'];
    if (id) {
      this.updatedObject = MOCK_EVENTS.filter((event) => event.id === id)[0];
    }
  }

  ngAfterViewInit() {
    Promise.resolve().then(() => {
      if (this.updatedObject) {
        this.eventForm.setValue({
          name: this.updatedObject.name,
          occurred: this.updatedObject.occurred,
        });
      }
    });
  }

  onSubmit(form: NgForm): void {
    console.log(form);
    this.router.navigate(['/epilepsy/events']);
  }
}
