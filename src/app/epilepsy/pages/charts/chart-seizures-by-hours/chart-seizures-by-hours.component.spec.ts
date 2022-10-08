import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartSeizuresByHoursComponent } from './chart-seizures-by-hours.component';

describe('ChartSeizuresByHoursComponent', () => {
  let component: ChartSeizuresByHoursComponent;
  let fixture: ComponentFixture<ChartSeizuresByHoursComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChartSeizuresByHoursComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartSeizuresByHoursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
