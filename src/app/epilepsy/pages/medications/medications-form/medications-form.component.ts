import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { ActivatedRoute, Router } from '@angular/router';
import moment from 'moment';
import { finalize, Observable, Subscription, take } from 'rxjs';
import { Medication } from './../../../../shared/models/medication.model';
import { formFieldHasError } from './../../../../shared/services/form-field-has-error';
import { MedicationsService } from './../../../../shared/services/medications.service';
import { DatesValidator } from './../../../../shared/validators/dates-validator';

@Component({
    selector: 'app-medications-form',
    templateUrl: './medications-form.component.html',
    styleUrls: ['./medications-form.component.scss'],
    standalone: false
})
export class MedicationsFormComponent implements OnInit {
  submitting = false;
  today = moment();
  error?: string;
  form: UntypedFormGroup;
  id?: string;
  private submitSubscription?: Subscription;
  private archivedSubscription?: Subscription;

  constructor(
    private medicationsService: MedicationsService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private fb: UntypedFormBuilder
  ) {
    this.form = this.fb.group(
      {
        name: ['', [Validators.required]],
        doseMorning: ['', [Validators.required, Validators.min(0)]],
        doseNoon: ['', [Validators.required, Validators.min(0)]],
        doseEvening: ['', [Validators.required, Validators.min(0)]],
        startDate: ['', [Validators.required, DatesValidator.inThePast()]],
        archived: [false, []],
        endDate: ['', []],
      },
      {
        validator: DatesValidator.startAndEnd('startDate', 'endDate'),
      }
    );
  }

  ngOnInit(): void {
    this.archivedSubscription = this.form.get('archived')?.valueChanges.subscribe((archived) => {
      if (archived) {
        this.form.get('endDate')?.setValidators([Validators.required, DatesValidator.inThePast()]);
      } else {
        this.form.get('endDate')?.reset();
        this.form.get('endDate')?.clearValidators();
      }
      this.form.get('endDate')?.updateValueAndValidity();
      this.form.updateValueAndValidity();
    });

    this.id = this.activatedRoute.snapshot.params['id'];
    if (this.id) {
      this.medicationsService
        .read(this.id)
        .pipe(take(1))
        .subscribe((result) => {
          this.form.setValue({
            name: result.name,
            doseMorning: result.doses.morning,
            doseNoon: result.doses.noon,
            doseEvening: result.doses.evening,
            startDate: result.startDate.toDate(),
            archived: result.archived,
            endDate: result.endDate?.toDate() || null,
          });
        });
    }
  }

  ngOnDestroy(): void {
    this.submitSubscription?.unsubscribe();
    this.archivedSubscription?.unsubscribe();
  }

  onSubmit(): void {
    this.submitting = true;
    const formData: Partial<Medication> = {
      name: this.form.value.name,
      doses: {
        morning: +this.form.value.doseMorning,
        noon: +this.form.value.doseNoon,
        evening: +this.form.value.doseEvening,
      },
      startDate: moment(this.form.value.startDate),
      archived: this.form.value.archived && !!this.form.value.endDate,
      endDate: this.form.value.archived ? moment(this.form.value.endDate) : undefined,
    };

    let submitObservable$: Observable<any>;
    if (this.id) {
      submitObservable$ = this.medicationsService.update(this.id, formData);
    } else {
      submitObservable$ = this.medicationsService.create(formData);
    }

    this.submitSubscription = submitObservable$
      .pipe(finalize(() => (this.submitting = false)))
      .subscribe({
        next: () => this.router.navigate([$localize`:@@routerLink-epilepsy-medications:/epilepsy/medications`]),
        error: (error) => (this.error = error.message),
      });
  }

  onArchivedChange(ob: MatCheckboxChange) {}

  hasError(path: string, errorCode: string) {
    return formFieldHasError(this.form, path, errorCode);
  }
}
