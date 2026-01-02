import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RouterTestingModule } from '@angular/router/testing';
import { CompareByAmountComponent } from './compare-by-amount.component';

describe('CompareByAmountComponent', () => {
  let component: CompareByAmountComponent;
  let fixture: ComponentFixture<CompareByAmountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CompareByAmountComponent],
      imports: [RouterTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(CompareByAmountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
