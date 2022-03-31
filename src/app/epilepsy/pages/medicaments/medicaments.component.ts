import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { Event } from 'src/app/shared/models/event.model';
import { Medicament } from 'src/app/shared/models/medicament.model';
import { Seizure } from 'src/app/shared/models/seizure.model';
import { TableComponent } from '../../components/table/table.component';
import { MedicamentsService } from './../../../shared/services/medicaments.service';

@Component({
  selector: 'app-medicaments',
  templateUrl: './medicaments.component.html',
  styleUrls: ['./medicaments.component.scss'],
})
export class MedicamentsComponent implements OnInit, OnDestroy {
  dataSource = new MatTableDataSource<Event | Medicament | Seizure>();
  loading = false;
  hasMore = false;
  public columns = ['name', 'dose', 'startDate', 'actions'];
  private dataSubscription?: Subscription;
  private deleteSubscription?: Subscription;

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
    if (this.deleteSubscription) {
      this.deleteSubscription.unsubscribe();
    }
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }

  onDelete(object: Event | Medicament | Seizure) {
    this.loading = true;
    this.deleteSubscription = this.medicamentsService
      .delete(object.id)
      .subscribe((medicamentsPage) => {
        this.dataSource.data = medicamentsPage.data;
        this.loading = false;
        this.hasMore = medicamentsPage.hasMore;
      });
  }
}
