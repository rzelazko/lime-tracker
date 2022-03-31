import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { Event } from 'src/app/shared/models/event.model';
import { Medicament } from 'src/app/shared/models/medicament.model';
import { Seizure } from 'src/app/shared/models/seizure.model';
import { TableComponent } from '../../components/table/table.component';
import { EventsService } from './../../../shared/services/events.service';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss'],
})
export class EventsComponent implements OnInit, OnDestroy {
  dataSource = new MatTableDataSource<Event | Medicament | Seizure>();
  loading = false;
  hasMore = false;
  public columns = ['name', 'occurred', 'actions'];
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
      .subscribe((evnentsPage) => {
        this.dataSource.data = evnentsPage.data;
        this.loading = false;
        this.hasMore = evnentsPage.hasMore;
      });
  }

  onRefresh(): void {
    this.eventsService.resetConcatenated();
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
    this.deleteSubscription = this.eventsService.delete(object.id).subscribe((eventsPage) => {
      this.dataSource.data = eventsPage.data;
      this.loading = false;
      this.hasMore = eventsPage.hasMore;
    });
  }
}
