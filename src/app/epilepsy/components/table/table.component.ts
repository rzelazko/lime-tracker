import { Component, Input, OnInit } from '@angular/core';
import { Attack } from 'src/app/shared/attack.model';
import { Event } from 'src/app/shared/event.model';
import { Medicament } from 'src/app/shared/medicament.model';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {
  @Input() public dataSource: (Event | Medicament | Attack)[] = [];
  @Input() public displayedColumns: String[] = []

  constructor() { }

  ngOnInit(): void {
  }

}
