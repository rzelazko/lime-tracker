import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { TrackingCore } from './../../../shared/models/tracking-core.model';
import { EventsService } from './../../../shared/services/events.service';
import { TableComponent } from './../../components/table/table.component';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss'],
  standalone: false
})
export class EventsComponent implements OnInit, OnDestroy {
  dataSource = new MatTableDataSource<TrackingCore>();
  loading = false;
  hasMore = false;
  columns = ['name', 'occurred', 'actions'];
  error?: string;
  private dataSubscription?: Subscription;
  private deleteSubscription?: Subscription;
  private eventsService: EventsService = inject(EventsService);

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
        error: (error) => {
          this.loading = false;
          this.error = error instanceof Error
            ? error.message
            : $localize`:@@unexpected-error-message:An unexpected error occurred`;
        }
      });
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

  onDelete(object: TrackingCore) {
    this.loading = true;
    this.deleteSubscription = this.eventsService
      .delete(object.id)
      .subscribe(() => this.onRefresh());
  }
}
