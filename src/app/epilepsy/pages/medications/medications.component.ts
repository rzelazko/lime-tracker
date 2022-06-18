import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { Medication } from '../../../shared/models/medication.model';
import { TrackingCore } from '../../../shared/models/tracking-core.model';
import { MedicationsService } from '../../../shared/services/medications.service';
import { TableComponent } from '../../components/table/table.component';

@Component({
  selector: 'app-medications',
  templateUrl: './medications.component.html',
  styleUrls: ['./medications.component.scss'],
})
export class MedicationsComponent implements OnInit, OnDestroy {
  dataSource = new MatTableDataSource<TrackingCore>();
  loading = false;
  hasMore = false;
  columns = ['name', 'dose', 'startEndDate', 'archived', 'actions'];
  error?: string;
  private dataSubscription?: Subscription;
  private deleteSubscription?: Subscription;
  private archiveSubscription?: Subscription;

  constructor(private medicationsService: MedicationsService) {}

  ngOnInit(): void {
    this.onLoadMore();
  }

  onLoadMore(): void {
    this.loading = true;
    this.dataSubscription = this.medicationsService
      .listConcatenated(TableComponent.PAGE_SIZE)
      .subscribe({
        next: (medicationsPage) => {
          this.dataSource.data = medicationsPage.data;
          this.loading = false;
          this.hasMore = medicationsPage.hasMore;
        },
        error: (error) => (this.error = error),
      });
  }

  onRefresh(): void {
    this.medicationsService.resetConcatenated();
    this.onLoadMore();
  }

  ngOnDestroy(): void {
    this.medicationsService.resetConcatenated();
    this.deleteSubscription?.unsubscribe();
    this.dataSubscription?.unsubscribe();
    this.archiveSubscription?.unsubscribe();
  }

  onDelete(object: TrackingCore) {
    this.loading = true;
    this.deleteSubscription = this.medicationsService
      .delete(object.id)
      .subscribe(() => this.onRefresh());
  }

  onArchive(medication: Medication) {
    this.loading = true;
    const newArchived = !medication.archived;
    const newEndDate = newArchived ? moment() : undefined;
    const updated: Partial<Medication> = { archived: newArchived, endDate: newEndDate };

    this.archiveSubscription = this.medicationsService
      .update(medication.id, updated)
      .subscribe(() => this.onRefresh());
  }
}
