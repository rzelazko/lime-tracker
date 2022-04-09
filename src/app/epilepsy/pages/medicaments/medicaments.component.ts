import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { Event } from '../../../shared/models/event.model';
import { Medicament } from '../../../shared/models/medicament.model';
import { Seizure } from '../../../shared/models/seizure.model';
import { MedicamentsService } from '../../../shared/services/medicaments.service';
import { TableComponent } from '../../components/table/table.component';

@Component({
  selector: 'app-medicaments',
  templateUrl: './medicaments.component.html',
  styleUrls: ['./medicaments.component.scss'],
})
export class MedicamentsComponent implements OnInit, OnDestroy {
  dataSource = new MatTableDataSource<Event | Medicament | Seizure>();
  loading = false;
  hasMore = false;
  public columns = ['name', 'dose', 'startDate', 'archived', 'actions'];
  private dataSubscription?: Subscription;
  private deleteSubscription?: Subscription;
  private archiveSubscription?: Subscription;

  constructor(private medicamentsService: MedicamentsService) {}

  ngOnInit(): void {
    this.onLoadMore();
  }

  onLoadMore(): void {
    this.loading = true;
    this.dataSubscription = this.medicamentsService
      .listConcatenated(TableComponent.PAGE_SIZE)
      .subscribe((medicamentsPage) => {
        this.dataSource.data = medicamentsPage.data;
        this.loading = false;
        this.hasMore = medicamentsPage.hasMore;
      });
  }

  onRefresh(): void {
    this.medicamentsService.resetConcatenated();
    this.onLoadMore();
  }

  ngOnDestroy(): void {
    this.medicamentsService.resetConcatenated();
    this.deleteSubscription?.unsubscribe();
    this.dataSubscription?.unsubscribe();
    this.archiveSubscription?.unsubscribe();
  }

  onDelete(object: Event | Medicament | Seizure) {
    this.loading = true;
    this.deleteSubscription = this.medicamentsService
      .delete(object.id)
      .subscribe(() => this.onRefresh());
  }

  onArchive(medicament: Medicament) {
    this.loading = true;
    const newArchived = !medicament.archived;
    const newEndDate = newArchived ? moment() : undefined;
    const updated: Partial<Medicament> = {archived: newArchived, endDate: newEndDate};

    this.archiveSubscription = this.medicamentsService
      .update(medicament.id, updated)
      .subscribe(() => this.onRefresh());
  }
}
