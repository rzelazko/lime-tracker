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
  loadedData: Seizure[] = [];
  loading = false;
  hasMore = false;
  columns = ['occurred', 'type', 'trigger', 'duration', 'actions'];
  private page = 0;
  private lastId = "";
  private dataSubscription?: Subscription;
  private deleteSubscription?: Subscription;

  constructor(private seizureService: SeizuresService) {}

  ngOnInit(): void {
    this.onLoadMore();
  }

  onLoadMore(): void {
    this.loading = true;
    this.dataSubscription = this.seizureService
      .list(TableComponent.PAGE_SIZE, this.lastId)
      .subscribe((data) => {
        this.loadedData = this.loadedData.concat(data);
        this.dataSource.data = this.loadedData;
        this.lastId = this.loadedData.length > 0 ? this.loadedData[this.loadedData.length - 1].id : "";
        this.page++;
        this.loading = false;
        this.hasMore = data.length > 0 && data.length >= TableComponent.PAGE_SIZE;
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
    this.deleteSubscription = this.seizureService.delete(object.id).subscribe();
  }
}
