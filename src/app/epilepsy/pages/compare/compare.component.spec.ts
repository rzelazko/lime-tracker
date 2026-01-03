import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router, provideRouter } from '@angular/router';
import { CompareComponent } from './compare.component';

describe('CompareComponent', () => {
  let component: CompareComponent;
  let fixture: ComponentFixture<CompareComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        MatToolbarModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        MatButtonModule,
        NoopAnimationsModule,
      ],
      declarations: [CompareComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(CompareComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form on ngOnInit', () => {
    expect(component.form).toBeDefined();
    expect(component.form.get('by')).toBeDefined();
    expect(component.form.get('amount')).toBeDefined();
  });

  it('should have initial form values', () => {
    expect(component.form.value.by).toEqual('month');
    expect(component.form.value.amount).toEqual(3);
  });

  it('should have required validator for "by" field', () => {
    const byControl = component.form.get('by');
    byControl?.setValue('');
    expect(byControl?.hasError('required')).toBe(true);
  });

  it('should have required, min and max validators for "amount" field', () => {
    const amountControl = component.form.get('amount');

    amountControl?.setValue(null);
    expect(amountControl?.hasError('required')).toBe(true);

    amountControl?.setValue(0);
    expect(amountControl?.hasError('min')).toBe(true);

    amountControl?.setValue(6);
    expect(amountControl?.hasError('max')).toBe(true);
  });

  it('should navigate on onSubmit', () => {
    const navigateSpy = spyOn(router, 'navigate');
    component.form.setValue({ by: 'year', amount: 2 });
    component.onSubmit();
    const expectedUrl = $localize`:@@routerLink-epilepsy-compare-by-amount:/epilepsy/compare/:by/:amount`
      .replace(':by', 'year')
      .replace(':amount', '2');
    expect(navigateSpy).toHaveBeenCalledWith([expectedUrl]);
  });

  it('should return true for hasError when form field has error', () => {
    const amountControl = component.form.get('amount');
    amountControl?.setValue(10);
    expect(component.hasError('amount', 'max')).toBe(true);
  });

  it('should return false for hasError when form field is valid', () => {
    const amountControl = component.form.get('amount');
    amountControl?.setValue(3);
    expect(component.hasError('amount', 'max')).toBe(false);
  });
});
