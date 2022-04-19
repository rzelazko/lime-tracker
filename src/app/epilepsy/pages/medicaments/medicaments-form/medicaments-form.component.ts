import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { finalize, Observable, Subscription, take } from 'rxjs';
import { Medicament } from '../../../../shared/models/medicament.model';
import { AuthService } from '../../../../shared/services/auth.service';
import { formFieldHasError } from '../../../../shared/services/form-field-has-error';
import { MedicamentsService } from '../../../../shared/services/medicaments.service';
import { DatesValidator } from '../../../../shared/validators/dates-validator';

@Component({
  selector: 'app-medicaments-form',
  templateUrl: './medicaments-form.component.html',
  styleUrls: ['./medicaments-form.component.scss'],
})
export class MedicamentsFormComponent implements OnInit {
  submitting = false;
  today = moment();
  error?: string;
  form: FormGroup;
  id?: string;
  private submitSubscription?: Subscription;
  private archivedSubscription?: Subscription;

  constructor(
    public auth: AuthService,
    private medicamentsService: MedicamentsService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder
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
      this.medicamentsService
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
    const formData: Partial<Medicament> = {
      name: this.form.value.name,
      doses: {
        morning: +this.form.value.doseMorning,
        noon: +this.form.value.doseNoon,
        evening: +this.form.value.doseEvening,
      },
      startDate: moment(this.form.value.startDate),
      archived: this.form.value.archived && this.form.value.endDate,
      endDate: this.form.value.archived ? this.form.value.endDate : null,
    };

    let submitObservable$: Observable<any>;
    if (this.id) {
      submitObservable$ = this.medicamentsService.update(this.id, formData);
    } else {
      submitObservable$ = this.medicamentsService.create(formData);
    }

    this.submitSubscription = submitObservable$
      .pipe(finalize(() => (this.submitting = false)))
      .subscribe({
        next: () => this.router.navigate(['/epilepsy/medicaments']),
        error: (error) => (this.error = error.message),
      });
  }

  onArchivedChange(ob: MatCheckboxChange) {}

  hasError(path: string, errorCode: string) {
    return formFieldHasError(this.form, path, errorCode);
  }
}
