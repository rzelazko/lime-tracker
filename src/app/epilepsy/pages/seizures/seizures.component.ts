import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { Event } from '../../../shared/models/event.model';
import { Medication } from '../../../shared/models/medication.model';
import { Seizure } from '../../../shared/models/seizure.model';
import { SeizuresService } from '../../../shared/services/seizures.service';
import { TableComponent } from '../../components/table/table.component';

@Component({
  selector: 'app-seizures',
  templateUrl: './seizures.component.html',
  styleUrls: ['./seizures.component.scss'],
})
export class SeizuresComponent implements OnInit, OnDestroy {
  dataSource = new MatTableDataSource<Event | Medication | Seizure>();
  loading = false;
  hasMore = false;
  columns = ['occurred', 'type', 'triggers', 'duration', 'actions'];
  private dataSubscription?: Subscription;
  private deleteSubscription?: Subscription;

  constructor(private seizuresService: SeizuresService) {}

  ngOnInit(): void {
    this.onLoadMore();
  }

  onLoadMore(): void {
    this.loading = true;
    this.dataSubscription = this.seizuresService
      .listConcatenated(TableComponent.PAGE_SIZE)
      .subscribe((seizuresPage) => {
        this.dataSource.data = seizuresPage.data;
        this.loading = false;
        this.hasMore = seizuresPage.hasMore;
      });
  }

  onRefresh(): void {
    this.seizuresService.resetConcatenated();
    this.onLoadMore();
  }

  ngOnDestroy(): void {
    this.seizuresService.resetConcatenated();
    this.deleteSubscription?.unsubscribe();
    this.dataSubscription?.unsubscribe();
  }

  onDelete(object: Event | Medication | Seizure) {
    this.loading = true;
    this.deleteSubscription = this.seizuresService
      .delete(object.id)
      .subscribe(() => this.onRefresh());
  }
}
