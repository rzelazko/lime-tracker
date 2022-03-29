import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Event } from 'src/app/shared/models/event.model';
import { Medicament } from 'src/app/shared/models/medicament.model';
import { Seizure } from 'src/app/shared/models/seizure.model';
import { ConfirmDeleteDialogComponent } from '../confirm-delete-dialog/confirm-delete-dialog.component';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit {
  static readonly PAGE_SIZE = 100;
  @Output('onDelete') deleteEvent = new EventEmitter<Event | Medicament | Seizure>();
  @Output('onLoadMore') loadMoreEvent = new EventEmitter<void>();
  @Input() dataSource?: any;
  @Input() displayedColumns: String[] = [];
  @Input() addBtnLink = '';
  @Input() addBtnText = '';
  @Input() updateLinkPrefix = '';
  @Input() occurredFormat = 'LLL';
  @Input() loading = false;
  @Input() hasMore = false;

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

  onLoadMore() {
    this.loadMoreEvent.emit();
  }
}
