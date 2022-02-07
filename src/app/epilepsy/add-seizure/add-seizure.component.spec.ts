import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSeizureComponent } from './add-seizure.component';

describe('AddSeizureComponent', () => {
  let component: AddSeizureComponent;
  let fixture: ComponentFixture<AddSeizureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddSeizureComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSeizureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
