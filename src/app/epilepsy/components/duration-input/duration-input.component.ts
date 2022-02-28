import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-duration-input',
  templateUrl: './duration-input.component.html',
  styleUrls: ['./duration-input.component.scss'],
})
export class DurationInputComponent implements OnInit {
  @Input() durationString?: string;
  @Input() disabled: boolean = false;

  @Output() durationStringChange: EventEmitter<string> = new EventEmitter<string>();

  public hours:string = '0';
  public minutes:string = '0';
  public seconds:string = '0';

  constructor() {}

  ngOnInit() {
    if (this.durationString) {
      let splitDuration = this.durationString.split(':');

      this.hours = splitDuration[0];
      this.minutes = splitDuration[1];
      this.seconds = splitDuration[2];
    }
  }

  check(type:String) {
    if (type === 'hours') {
      this.hours = this.getValidValue(this.hours, 23);
    } else if (type === 'minutes') {
      this.minutes =this.getValidValue(this.minutes, 59);
    } else if (type === 'seconds') {
      this.seconds = this.getValidValue(this.seconds, 59);
    }

    this.durationString = `${this.hours}:${this.minutes}:${this.seconds}`;
    this.durationStringChange.emit(this.durationString);
  }

  getValidValue(value:string, max:number):string {
    let n;
    if (/^\d+$/.test(value)) {
      n = parseInt(value);
      n = Math.max(0, n);
      n = Math.min(max, n);
      return n.toString();
    } else {
      return '0';
    }
  }
}
