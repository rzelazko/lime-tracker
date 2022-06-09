import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Event } from '../../../shared/models/event.model';
import { Medication } from '../../../shared/models/medication.model';
import { Period } from '../../../shared/models/period.model';
import { Seizure } from '../../../shared/models/seizure.model';
import { TrackingCore } from '../../../shared/models/tracking-core.model';

@Component({
  selector: 'app-confirm-delete-dialog',
  templateUrl: './confirm-delete-dialog.component.html',
  styleUrls: ['./confirm-delete-dialog.component.scss'],
})
export class ConfirmDeleteDialogComponent implements OnInit {
  public type: string;
  public title: string;

  constructor(@Inject(MAT_DIALOG_DATA) private data: TrackingCore) {
    if (data.objectType === 'EVENT') {
      this.type = $localize`:@confirm-delete-type-event:event`;
      this.title = (data as Event).name;
    } else if (data.objectType === 'MEDICATION') {
      this.type = $localize`:@confirm-delete-type-medication:medication`;
      const medication: Medication = data as Medication;
      this.title = `${data.name} ${data.doses.morning} - ${data.doses.noon} - ${data.doses.evening}`;
    } else if (data.objectType === 'SEIZURE') {
      this.type = $localize`:@confirm-delete-type-seizure:seizure`;
      this.title = (data as Seizure).occurred.format('LLL');
    } else if (data.objectType === 'PERIOD') {
      this.type = $localize`:@confirm-delete-type-period:period`;
      this.title = (data as Period).startDate.format('LLL');
    } else {
      this.type = $localize`:@confirm-delete-type-unknown:unknown`;
      this.title = $localize`:@confirm-delete-type-unknown:unknown`;
    }
  }

  ngOnInit(): void {}
}
