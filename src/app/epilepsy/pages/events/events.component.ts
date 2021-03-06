import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { Event } from '../../../shared/models/event.model';
import { Medication } from '../../../shared/models/medication.model';
import { Seizure } from '../../../shared/models/seizure.model';
import { EventsService } from '../../../shared/services/events.service';
import { TableComponent } from '../../components/table/table.component';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss'],
})
export class EventsComponent implements OnInit, OnDestroy {
  dataSource = new MatTableDataSource<Event | Medication | Seizure>();
  loading = false;
  hasMore = false;
  columns = ['name', 'occurred', 'actions'];
  error?: string;
  private dataSubscription?: Subscription;
  private deleteSubscription?: Subscription;

  constructor(private eventsService: EventsService) {}

  ngOnInit(): void {
    this.onLoadMore();
  }

  onLoadMore(): void {
    this.loading = true;
    this.dataSubscription = this.eventsService
      .listConcatenated(TableComponent.PAGE_SIZE)
      .subscribe({
        next: (evnentsPage) => {
        this.dataSource.data = evnentsPage.data;
        this.loading = false;
        this.hasMore = evnentsPage.hasMore;
      },
      error: (error) => (this.error = error)});
  }

  onRefresh(): void {
    this.eventsService.resetConcatenated();
    this.onLoadMore();
  }

  ngOnDestroy(): void {
    this.eventsService.resetConcatenated();
    this.deleteSubscription?.unsubscribe();
    this.dataSubscription?.unsubscribe();
  }

  onDelete(object: Event | Medication | Seizure) {
    this.loading = true;
    this.deleteSubscription = this.eventsService
      .delete(object.id)
      .subscribe(() => this.onRefresh());
  }
}
