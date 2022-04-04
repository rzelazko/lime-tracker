import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { Subscription, take, Observable } from 'rxjs';
import { Seizure } from 'src/app/shared/models/seizure.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { formFieldHasError } from 'src/app/shared/services/form-field-has-error';
import { SeizuresService } from 'src/app/shared/services/seizures.service';

@Component({
  selector: 'app-seizures-form',
  templateUrl: './seizures-form.component.html',
  styleUrls: ['./seizures-form.component.scss'],
})
export class SeizuresFormComponent implements OnInit, OnDestroy {
  error?: string;
  form: FormGroup;
  id?: string;
  private submitSubscription?: Subscription;

  constructor(
    public auth: AuthService,
    private seizuresService: SeizuresService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      occurredDate: ['', [Validators.required]],
      occurredTime: ['', [Validators.required]],
      duration: ['', [Validators.required, Validators.min(1)]],
      seizureType: ['', [Validators.required]],
      seizureTrigger: [''],
    });
  }

  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.params['id'];
    if (this.id) {
      this.seizuresService
        .read(this.id)
        .pipe(take(1))
        .subscribe((result) => {
          this.form.setValue({
            occurredDate: result.occurred.toDate(),
            occurredTime: result.occurred.format('hh:mm'),
            duration: result.duration.minutes(),
            seizureType: result.type,
            seizureTrigger: result.trigger,
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
    const formData: Partial<Seizure> = {
      occurred: moment(this.form.value.occurredDate)
        .hours(this.form.value.occurredTime.split(':')[0])
        .minutes(this.form.value.occurredTime.split(':')[1]),
      duration: this.form.value.duration,
      type: this.form.value.seizureType,
      trigger: this.form.value.seizureTrigger || undefined,
    };

    let submitObservable$: Observable<any>;
    if (this.id) {
      submitObservable$ = this.seizuresService.update(this.id, formData);
    } else {
      submitObservable$ = this.seizuresService.create(formData);
    }

    this.submitSubscription = submitObservable$.subscribe({
      next: () => this.router.navigate(['/epilepsy/seizures']),
      error: (error) => (this.error = error.message),
    });
  }

  hasError(path: string, errorCode: string) {
    return formFieldHasError(this.form, path, errorCode);
  }
}
