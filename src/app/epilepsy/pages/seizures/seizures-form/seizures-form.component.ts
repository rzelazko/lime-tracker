import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import moment from 'moment';
import { finalize, Observable, Subscription, take } from 'rxjs';
import { UserData } from './../../../../auth/models/user-details.model';
import { Seizure } from './../../../../shared/models/seizure.model';
import { AuthService } from './../../../../shared/services/auth.service';
import { formFieldHasError } from './../../../../shared/services/form-field-has-error';
import { SeizuresService } from './../../../../shared/services/seizures.service';
import { UserDetailsService } from './../../../../shared/services/user-details.service';
import { DatesValidator } from './../../../../shared/validators/dates-validator';

@Component({
  selector: 'app-seizures-form',
  templateUrl: './seizures-form.component.html',
  styleUrls: ['./seizures-form.component.scss'],
})
export class SeizuresFormComponent implements OnInit, OnDestroy {
  static readonly DATE_TIME_FORMAT = 'YYYY-MM-DDTHH:mm';
  submitting = false;
  today = moment().format(SeizuresFormComponent.DATE_TIME_FORMAT);
  error?: string;
  form: UntypedFormGroup;
  id?: string;
  userDetails$: Observable<UserData>;
  private submitSubscription?: Subscription;

  constructor(
    private auth: AuthService,
    private userDetails: UserDetailsService,
    private seizuresService: SeizuresService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private fb: UntypedFormBuilder
  ) {
    this.form = this.fb.group({
      occurred: ['', [Validators.required, DatesValidator.inThePast()]],
      duration: ['', [Validators.required, Validators.min(1)]],
      seizureType: ['', [Validators.required]],
      seizureTriggers: [[]],
    });
    this.userDetails$ = userDetails.get(auth.user());
  }

  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.params['id'];
    if (this.id) {
      this.seizuresService
        .read(this.id)
        .pipe(take(1))
        .subscribe((result) => {
          this.form.setValue({
            occurred: result.occurred.format(SeizuresFormComponent.DATE_TIME_FORMAT),
            duration: result.duration.minutes(),
            seizureType: result.type,
            seizureTriggers: result.triggers || [],
          });
        });
    }
  }

  ngOnDestroy(): void {
    this.submitSubscription?.unsubscribe();
  }

  onSubmit(): void {
    this.submitting = true;
    const formData: Partial<Seizure> = {
      occurred: moment(this.form.value.occurred),
      duration: moment.duration(this.form.value.duration, 'minutes'),
      type: this.form.value.seizureType,
      triggers: this.form.value.seizureTriggers || undefined,
    };

    let submitObservable$: Observable<any>;
    if (this.id) {
      submitObservable$ = this.seizuresService.update(this.id, formData);
    } else {
      submitObservable$ = this.seizuresService.create(formData);
    }

    this.submitSubscription = submitObservable$
      .pipe(finalize(() => (this.submitting = false)))
      .subscribe({
        next: () =>
          this.router.navigate([$localize`:@@routerLink-epilepsy-seizures:/epilepsy/seizures`]),
        error: (error) => (this.error = error.message),
      });
  }

  hasError(path: string, errorCode: string) {
    return formFieldHasError(this.form, path, errorCode);
  }
}
