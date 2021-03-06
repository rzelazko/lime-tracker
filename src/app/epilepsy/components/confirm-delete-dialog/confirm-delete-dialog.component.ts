import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Event, isEvent } from '../../../shared/models/event.model';
import { isMedication, Medication } from '../../../shared/models/medication.model';
import { isSeizure, Seizure } from '../../../shared/models/seizure.model';

@Component({
  selector: 'app-confirm-delete-dialog',
  templateUrl: './confirm-delete-dialog.component.html',
  styleUrls: ['./confirm-delete-dialog.component.scss'],
})
export class ConfirmDeleteDialogComponent implements OnInit {
  public type: string;
  public title: string;

  constructor(@Inject(MAT_DIALOG_DATA) private data: Event | Medication | Seizure) {
    if (isEvent(data)) {
      this.type = $localize`:@confirm-delete-type-event:event`;
      this.title = (data as Event).name;
    } else if (isMedication(data)) {
      this.type = $localize`:@confirm-delete-type-medication:medication`;
      const medication: Medication = data as Medication;
      this.title = `${data.name} ${data.doses.morning} - ${data.doses.noon} - ${data.doses.evening}`;
    } else if (isSeizure(data)) {
      this.type = $localize`:@confirm-delete-type-seizure:seizure`;
      this.title = (data as Seizure).occurred.format('LLL');
    } else {
      this.type = $localize`:@confirm-delete-type-unknown:unknown`;
      this.title = $localize`:@confirm-delete-type-unknown:unknown`;
    }
  }

  ngOnInit(): void {}
}
