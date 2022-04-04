import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { Observable, Subscription, take } from 'rxjs';
import { Medicament } from 'src/app/shared/models/medicament.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { formFieldHasError } from 'src/app/shared/services/form-field-has-error';
import { MedicamentsService } from 'src/app/shared/services/medicaments.service';

@Component({
  selector: 'app-medicaments-form',
  templateUrl: './medicaments-form.component.html',
  styleUrls: ['./medicaments-form.component.scss'],
})
export class MedicamentsFormComponent implements OnInit {
  error?: string;
  form: FormGroup;
  id?: string;
  private submitSubscription?: Subscription;

  constructor(
    public auth: AuthService,
    private medicamentsService: MedicamentsService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      doseMorning: ['', [Validators.required, Validators.min(0)]],
      doseNoon: ['', [Validators.required, Validators.min(0)]],
      doseEvening: ['', [Validators.required, Validators.min(0)]],
      startDate: ['', [Validators.required]],
      archived: [false]
    });
  }

  ngOnInit(): void {
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
            archived: result.archived
          });
        });
    }
  }

  ngOnDestroy(): void {
    if (this.submitSubscription) {
      this.submitSubscription.unsubscribe();
    }
  }

  onSubmit(): void {
    const formData: Partial<Medicament> = {
      name: this.form.value.name,
      doses: {
        morning: +this.form.value.doseMorning,
        noon: +this.form.value.doseNoon,
        evening: +this.form.value.doseEvening,
      },
      startDate: moment(this.form.value.startDate),
      archived: this.form.value.archived
    };

    let submitObservable$: Observable<any>;
    if (this.id) {
      submitObservable$ = this.medicamentsService.update(this.id, formData);
    } else {
      submitObservable$ = this.medicamentsService.create(formData);
    }

    this.submitSubscription = submitObservable$.subscribe({
      next: () => this.router.navigate(['/epilepsy/medicaments']),
      error: (error) => (this.error = error.message),
    });
  }

  hasError(path: string, errorCode: string) {
    return formFieldHasError(this.form, path, errorCode);
  }
}
