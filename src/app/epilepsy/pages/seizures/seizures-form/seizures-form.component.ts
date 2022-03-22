import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { Subscription, take } from 'rxjs';
import { Seizure } from 'src/app/shared/models/seizure.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { SeizuresService } from 'src/app/shared/services/seizures.service';

@Component({
  selector: 'app-seizures-form',
  templateUrl: './seizures-form.component.html',
  styleUrls: ['./seizures-form.component.scss'],
})
export class SeizuresFormComponent implements OnInit, OnDestroy {
  @ViewChild('seizureForm') seizureForm!: NgForm;
  public updatedObject?:Seizure; // TODO get rid of it if not needed
  public error?: string;
  private id?: string;
  private formSubscription?: Subscription;

  constructor(
    public auth: AuthService,
    private seizureService: SeizuresService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.params['id'];
    if (this.id) {
      this.seizureService.get(this.id).pipe(take(1)).subscribe(
        seizure => {
          this.seizureForm.setValue({
            occurredDate: seizure.occurred,
            occurredTime: seizure.occurred.format('hh:mm'),
            seizureType: seizure.type,
            seizureTrigger: seizure.trigger || '',
            duration: seizure.duration.minutes(),
          })
        }
      );
      // TODO orignal: this.updatedObject = MOCK_SEIZURES.filter((seizure) => seizure.id === this.id)[0];
    }
  }

  ngOnDestroy(): void {
    if (this.formSubscription) {
      this.formSubscription.unsubscribe();
    }
  }

  /* TODO this update doesn't work at all
  ngAfterViewInit() {
    Promise.resolve().then(() => {
      if (this.updatedObject) {
        this.seizureForm.setValue({
          occurredDate: this.updatedObject.occurred,
          occurredTime: this.updatedObject.occurred.format("hh:mm"),
          seizureType: this.updatedObject.type,
          seizureTrigger: this.updatedObject.trigger || '',
          duration: this.updatedObject.duration.minutes()
        });
      }
    });
  }*/

  onSubmit(form: NgForm): void {
    const formData: Seizure = {
      // TODO id: this.id || undefined,
      occurred: moment(form.value.occurredDate)
        .hours(form.value.occurredTime.split(':')[0])
        .minutes(form.value.occurredTime.split(':')[1]),
      duration: form.value.duration,
      type: form.value.seizureType,
      trigger: form.value.seizureTrigger || undefined,
    };
    console.log(formData);
    this.formSubscription = this.seizureService.create(formData).subscribe({
      next: () => this.router.navigate(['/epilepsy/seizures']),
      error: (error) => (this.error = error.message),
    });
  }
}
