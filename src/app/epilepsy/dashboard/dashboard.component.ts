import { Component, OnInit } from '@angular/core';
import { Medicament } from './../../shared/medicament.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  medicaments: Medicament[] = [];
  lastSeizure?: Date;
  daysSinceLastSeizure: number = 0;
  hoursSinceLastSeizure: number = 0;
  minSinceLastSeizure: number = 0;

  constructor() {}

  ngOnInit(): void {
    const now = new Date();
    this.medicaments.push(
      { name: 'Kepra', doses: {morning: 100, noon: 0, evening: 150 }},
      { name: 'Lamitrin', doses: {morning: 1500, noon: 0, evening: 1000 } },
      { name: 'Topamax', doses: {morning: 125, noon: 0, evening: 125 }}
    );
    this.lastSeizure = new Date(
      now.getFullYear(),
      now.getMonth(),
      5,
      now.getHours(),
      now.getMinutes(),
      now.getSeconds()
    );
    let timeSinceLastSeizure = new Date(
      now.getTime() - this.lastSeizure.getTime()
    );

    this.daysSinceLastSeizure = timeSinceLastSeizure.getDate();
    this.hoursSinceLastSeizure = timeSinceLastSeizure.getHours();
    this.minSinceLastSeizure = timeSinceLastSeizure.getMinutes();
  }
}
