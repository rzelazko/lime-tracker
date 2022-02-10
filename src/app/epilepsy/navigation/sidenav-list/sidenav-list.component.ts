import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.scss']
})
export class SidenavListComponent implements OnInit {
  @Output() sidenavClose = new EventEmitter<void>();
  @Output() logout = new EventEmitter<void>();

  constructor() { }

  ngOnInit() {
  }

  onClose() {
    this.sidenavClose.emit();
  }

  onLogout() {
    this.logout.emit();
  }
}
