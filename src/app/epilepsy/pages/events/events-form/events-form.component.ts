import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { finalize, Observable, Subscription, take } from 'rxjs';
import { Event } from './../../../../shared/models/event.model';
import { EventsService } from './../../../../shared/services/events.service';
import { formFieldHasError } from './../../../../shared/services/form-field-has-error';
import { DatesValidator } from './../../../../shared/validators/dates-validator';

@Component({
  selector: 'app-events-form',
  templateUrl: './events-form.component.html',
  styleUrls: ['./events-form.component.scss'],
})
export class EventsFormComponent implements OnInit {
  submitting = false;
  today = moment();
  error?: string;
  form: FormGroup;
  id?: string;
  private submitSubscription?: Subscription;

  constructor(
    private eventsService: EventsService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      occurred: ['', [Validators.required, DatesValidator.inThePast()]],
    });
  }

  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.params['id'];
    if (this.id) {
      this.eventsService
        .read(this.id)
        .pipe(take(1))
        .subscribe((result) => {
          this.form.setValue({
            name: result.name,
            occurred: result.occurred.toDate(),
          });
        });
    }
  }

  ngOnDestroy(): void {
    this.submitSubscription?.unsubscribe();
  }

  onSubmit(): void {
    this.submitting = true;
    const formData: Partial<Event> = {
      name: this.form.value.name,
      occurred: moment(this.form.value.occurred),
    };

    let submitObservable$: Observable<any>;
    if (this.id) {
      submitObservable$ = this.eventsService.update(this.id, formData);
    } else {
      submitObservable$ = this.eventsService.create(formData);
    }

    this.submitSubscription = submitObservable$
    .pipe(finalize(() => this.submitting = false))
    .subscribe({
      next: () => this.router.navigate([$localize`:@@routerLink-epilepsy-events:/epilepsy/events`]),
      error: (error) => (this.error = error.message),
    });
  }

  hasError(path: string, errorCode: string) {
    return formFieldHasError(this.form, path, errorCode);
  }
}
