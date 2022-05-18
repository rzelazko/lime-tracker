import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ErrorCardComponent } from './error-card.component';
import { MatCardModule } from '@angular/material/card';

describe('ErrorCardComponent', () => {
  let component: ErrorCardComponent;
  let fixture: ComponentFixture<ErrorCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ErrorCardComponent],
      imports: [MatCardModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display error if non empty', () => {
    // given
    component.error = 'Sample error';

    // when
    fixture.detectChanges();

    // then
    const p: HTMLElement = fixture.nativeElement.querySelector('p.error-message');
    expect(p).not.toBeNull();
    expect(p.textContent).toContain(component.error);
  });

  it('should not contain error-message paragraph if empty', () => {
    // given
    component.error = '';

    // when
    fixture.detectChanges();

    // then
    const p: HTMLElement = fixture.nativeElement.querySelector('p.error-message');
    expect(p).toBeNull();
  });
});
