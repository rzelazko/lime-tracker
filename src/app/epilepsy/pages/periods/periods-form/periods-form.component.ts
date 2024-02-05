import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { finalize, Observable, Subscription, take } from 'rxjs';
import { Period } from './../../../../shared/models/period.model';
import { formFieldHasError } from './../../../../shared/services/form-field-has-error';
import { PeriodsService } from './../../../../shared/services/periods.service';
import { DatesValidator } from './../../../../shared/validators/dates-validator';

@Component({
  selector: 'app-periods-form',
  templateUrl: './periods-form.component.html',
  styleUrls: ['./periods-form.component.scss']
})
export class PeriodsFormComponent implements OnInit {
  submitting = false;
  today = moment();
  error?: string;
  form: UntypedFormGroup;
  id?: string;
  private submitSubscription?: Subscription;

  constructor(
    private periodsService: PeriodsService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private fb: UntypedFormBuilder
  ) {
    this.form = this.fb.group(
      {
        startDate: ['', [Validators.required, DatesValidator.inThePast()]],
        endDate: ['', [DatesValidator.isDate()]],
      },
      {
        validator: DatesValidator.startAndEnd('startDate', 'endDate'),
      }
    );
  }

  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.params['id'];
    if (this.id) {
      this.periodsService
        .read(this.id)
        .pipe(take(1))
        .subscribe((result) => {
          this.form.setValue({
            startDate: result.startDate.toDate(),
            endDate: result.endDate?.toDate() || null,
          });
        });
    }
  }

  ngOnDestroy(): void {
    this.submitSubscription?.unsubscribe();
  }

  onSubmit(): void {
    this.submitting = true;
    const formData: Partial<Period> = {
      startDate: moment(this.form.value.startDate),
      endDate: this.form.value.endDate ? moment(this.form.value.endDate) : undefined,
    };

    let submitObservable$: Observable<any>;
    if (this.id) {
      submitObservable$ = this.periodsService.update(this.id, formData);
    } else {
      submitObservable$ = this.periodsService.create(formData);
    }

    this.submitSubscription = submitObservable$
      .pipe(finalize(() => (this.submitting = false)))
      .subscribe({
        next: () => this.router.navigate([$localize`:@@routerLink-epilepsy-periods:/epilepsy/periods`]),
        error: (error) => (this.error = error.message),
      });
  }

  hasError(path: string, errorCode: string) {
    return formFieldHasError(this.form, path, errorCode);
  }
}
