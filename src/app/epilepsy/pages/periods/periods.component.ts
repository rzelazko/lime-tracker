import { Component, OnInit } from '@angular/core';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { Subscription } from 'rxjs';
import { TrackingCore } from './../../../shared/models/tracking-core.model';
import { PeriodsService } from './../../../shared/services/periods.service';
import { TableComponent } from './../../components/table/table.component';

@Component({
  selector: 'app-periods',
  templateUrl: './periods.component.html',
  styleUrls: ['./periods.component.scss'],
})
export class PeriodsComponent implements OnInit {
  dataSource = new MatTableDataSource<TrackingCore>();
  loading = false;
  hasMore = false;
  columns = ['startDate', 'endDate', 'actions'];
  error?: string;
  private dataSubscription?: Subscription;
  private deleteSubscription?: Subscription;

  constructor(private periodsService: PeriodsService) {}

  ngOnInit(): void {
    this.onLoadMore();
  }

  onLoadMore(): void {
    this.loading = true;
    this.dataSubscription = this.periodsService
      .listConcatenated(TableComponent.PAGE_SIZE)
      .subscribe({
        next: (periodsPage) => {
          this.dataSource.data = periodsPage.data;
          this.loading = false;
          this.hasMore = periodsPage.hasMore;
        },
        error: (error) => (this.error = error),
      });
  }

  onRefresh(): void {
    this.periodsService.resetConcatenated();
    this.onLoadMore();
  }

  ngOnDestroy(): void {
    this.periodsService.resetConcatenated();
    this.deleteSubscription?.unsubscribe();
    this.dataSubscription?.unsubscribe();
  }

  onDelete(object: TrackingCore) {
    this.loading = true;
    this.deleteSubscription = this.periodsService
      .delete(object.id)
      .subscribe(() => this.onRefresh());
  }
}
