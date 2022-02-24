import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {
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
