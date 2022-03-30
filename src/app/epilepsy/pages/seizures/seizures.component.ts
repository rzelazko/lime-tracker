import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { Event } from 'src/app/shared/models/event.model';
import { Medicament } from 'src/app/shared/models/medicament.model';
import { Seizure } from 'src/app/shared/models/seizure.model';
import { SeizuresService } from 'src/app/shared/services/seizures.service';
import { TableComponent } from '../../components/table/table.component';

@Component({
  selector: 'app-seizures',
  templateUrl: './seizures.component.html',
  styleUrls: ['./seizures.component.scss'],
})
export class SeizuresComponent implements OnInit, OnDestroy {
  dataSource = new MatTableDataSource<Seizure>();
  loading = false;
  hasMore = false;
  columns = ['occurred', 'type', 'trigger', 'duration', 'actions'];
  private dataSubscription?: Subscription;
  private deleteSubscription?: Subscription;

  constructor(private seizureService: SeizuresService) {}

  ngOnInit(): void {
    this.onLoadMore();
  }

  onLoadMore(): void {
    this.loading = true;
    this.dataSubscription = this.seizureService
      .listConcatenated(TableComponent.PAGE_SIZE)
      .subscribe((seizuresPage) => {
        this.dataSource.data = seizuresPage.data;
        this.loading = false;
        this.hasMore = seizuresPage.hasMore;
      });
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
    this.deleteSubscription = this.seizureService.delete(object.id).subscribe((seizuresPage) => {
      this.dataSource.data = seizuresPage.data;
      this.loading = false;
      this.hasMore = seizuresPage.hasMore;
    });
  }
}
