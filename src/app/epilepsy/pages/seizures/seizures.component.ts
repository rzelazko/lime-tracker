import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { Event } from 'src/app/shared/models/event.model';
import { Medicament } from 'src/app/shared/models/medicament.model';
import { Seizure } from 'src/app/shared/models/seizure.model';
import { SeizuresService } from 'src/app/shared/services/seizures.service';

@Component({
  selector: 'app-seizures',
  templateUrl: './seizures.component.html',
  styleUrls: ['./seizures.component.scss'],
})
export class SeizuresComponent implements OnInit, OnDestroy {
  data$: Observable<Seizure[]>;
  columns = ['occurred', 'type', 'trigger', 'duration', 'actions'];
  private deleteSubscription?: Subscription;

  constructor(private seizureService: SeizuresService) {
    this.data$ = seizureService.list();
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    if (this.deleteSubscription) {
      this.deleteSubscription.unsubscribe();
    }
  }

  onDelete(object: Event | Medicament | Seizure) {
    this.deleteSubscription = this.seizureService.delete(object.id).subscribe();
  }
}
