import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { CompareByAmountComponent } from './compare-by-amount.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('CompareByAmountComponent', () => {
  let component: CompareByAmountComponent;
  let fixture: ComponentFixture<CompareByAmountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CompareByAmountComponent],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of({
              get: (key: string) => {
                if (key === 'by') {
                  return 'month';
                }
                if (key === 'amount') {
                  return '3';
                }
                return null;
              },
            }),
          },
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(CompareByAmountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
