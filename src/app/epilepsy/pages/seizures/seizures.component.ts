import { Component, OnInit } from '@angular/core';
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
export class SeizuresComponent implements OnInit {
  public data$: Observable<Seizure[]>;
  public columns = ['occurred', 'type', 'trigger', 'duration', 'actions'];

  constructor(private seizureService: SeizuresService) {
    this.data$ = seizureService.list();
  }

  ngOnInit(): void {}

  onDelete(object: Event | Medicament | Seizure) {
    console.log('Delete', object);
  }
}
