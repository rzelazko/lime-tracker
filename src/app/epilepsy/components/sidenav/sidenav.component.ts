import { Component, EventEmitter, Inject, LOCALE_ID, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
})
export class SidenavComponent implements OnInit {
  @Output() sidenavClose = new EventEmitter<void>();

  constructor(@Inject(LOCALE_ID) public locale?: string) {}

  ngOnInit() {
    console.log(this.locale);
  }

  onClose() {
    this.sidenavClose.emit();
  }
}
