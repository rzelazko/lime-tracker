import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Seizure } from 'src/app/shared/seizure.model';
import { Event } from 'src/app/shared/event.model';
import { Medicament } from 'src/app/shared/medicament.model';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDeleteDialogComponent } from '../dialogs/confirm-delete-dialog/confirm-delete-dialog.component';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit {
  @Output('onDelete') public deleteEvent = new EventEmitter<Event | Medicament | Seizure>();
  @Input() public dataSource: (Event | Medicament | Seizure)[] = [];
  @Input() public displayedColumns: String[] = [];
  @Input() public addBtnLink = '';
  @Input() public addBtnText = '';
  @Input() public updateLinkPrefix = '';
  @Input() public occurredFormat = 'LLL';

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {}

  onDelete(element: Event | Medicament | Seizure): void {
    const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent, { data: { ...element } });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.deleteEvent.emit(element);
      }
    });
  }
}
