import { Component, Input, OnInit } from '@angular/core';
import { Seizure } from 'src/app/shared/seizure.model';
import { Event } from 'src/app/shared/event.model';
import { Medicament } from 'src/app/shared/medicament.model';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit {
  @Input() public dataSource: (Event | Medicament | Seizure)[] = [];
  @Input() public displayedColumns: String[] = [];
  @Input() public addBtnLink = '';
  @Input() public addBtnText = '';
  @Input() public updateLinkPrefix = '';

  constructor() {}

  ngOnInit(): void {}
}
