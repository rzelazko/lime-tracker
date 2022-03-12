import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Event } from 'src/app/shared/models/event.model';
import { Medicament } from 'src/app/shared/models/medicament.model';
import { Seizure } from 'src/app/shared/models/seizure.model';
import { isEvent } from '../../../shared/models/event.model';
import { isMedicament } from '../../../shared/models/medicament.model';
import { isSeizure } from '../../../shared/models/seizure.model';

@Component({
  selector: 'app-confirm-delete-dialog',
  templateUrl: './confirm-delete-dialog.component.html',
  styleUrls: ['./confirm-delete-dialog.component.scss'],
})
export class ConfirmDeleteDialogComponent implements OnInit {
  public type: string;
  public title: string;

  constructor(@Inject(MAT_DIALOG_DATA) private data: Event | Medicament | Seizure) {
    if (isEvent(data)) {
      this.type = 'event';
      this.title = (data as Event).name;
    } else if (isMedicament(data)) {
      this.type = 'medicament';
      const medicament: Medicament = data as Medicament;
      this.title = `${data.name} ${data.doses.morning} - ${data.doses.noon} - ${data.doses.evening}`;
    } else if (isSeizure(data)) {
      this.type = 'seizure';
      this.title = (data as Seizure).occurred.format('LLL');
    } else {
      this.type = 'Unknown';
      this.title = 'unknown';
    }
  }

  ngOnInit(): void {}
}
