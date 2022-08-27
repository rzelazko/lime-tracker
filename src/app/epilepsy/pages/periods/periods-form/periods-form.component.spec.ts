import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule, ValidationErrors } from '@angular/forms';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { of } from 'rxjs';
import { Period } from './../../../../shared/models/period.model';
import { PeriodsService } from './../../../../shared/services/periods.service';
import { UserDetailsService } from '../../../../shared/services/user-details.service';
import { PeriodsFormComponent } from './periods-form.component';

describe('PeriodsFormComponent', () => {
  let formComponent: PeriodsFormComponent;
  let periodsServiceSpy: jasmine.SpyObj<PeriodsService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let activatedRoute: ActivatedRoute;

  let fixture: ComponentFixture<PeriodsFormComponent>;

  beforeEach(async () => {
    const periodsServiceSpyObj = jasmine.createSpyObj('PeriodsService', [
      'create',
      'read',
      'update',
    ]);
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);
    const activatedRouteMockObj = { snapshot: { params: {} } };

    await TestBed.configureTestingModule({
      declarations: [PeriodsFormComponent],
      providers: [
        { provide: PeriodsService, useValue: periodsServiceSpyObj },
        { provide: Router, useValue: routerSpyObj },
        { provide: ActivatedRoute, useValue: activatedRouteMockObj },
        UserDetailsService,
      ],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        NoopAnimationsModule,
        MatCardModule,
        MatCheckboxModule,
        MatDatepickerModule,
        MatFormFieldModule,
        MatInputModule,
        MatMomentDateModule,
        MatProgressSpinnerModule,
        MatSelectModule,
        MatToolbarModule,
      ],
    }).compileComponents();
    periodsServiceSpy = TestBed.inject(PeriodsService) as jasmine.SpyObj<PeriodsService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    activatedRoute = TestBed.inject(ActivatedRoute);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PeriodsFormComponent);
    formComponent = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(formComponent).toBeTruthy();
  });

  it('should fail if endDate is before startDate', () => {
    // given
    const formValues = {
      startDate: moment('2021-05-15').toDate(),
      endDate: moment('2021-05-14').toDate(),
    };

    // when
    formComponent.form.setValue(formValues);

    // then
    expect(formComponent.form?.valid).toBeFalsy();
    expect(formComponent.form.get('endDate')?.errors).not.toBeNull();
    expect(
      (formComponent.form.get('endDate')?.errors as ValidationErrors)['isBefore']
    ).toBeTruthy();
  });

  it('should pass if endDate is missing', () => {
    // given
    const formValues = {
      startDate: moment('2021-05-15').toDate(),
      endDate: '',
    };

    // when
    formComponent.form.setValue(formValues);

    // then
    expect(formComponent.form?.valid).toBeTruthy();
  });

  it('should fail if endDate is invalid', () => {
    // given
    const formValues = {
      startDate: moment('2021-05-15').toDate(),
      endDate: 'not a valid date',
    };

    // when
    formComponent.form.setValue(formValues);

    // then
    expect(formComponent.form?.valid).toBeFalsy();
    expect(formComponent.form.get('endDate')?.errors).not.toBeNull();
    expect(
      (formComponent.form.get('endDate')?.errors as ValidationErrors)['invalid']
    ).toBeTruthy();
  });

  it('should convert form data into Period object on submit', async () => {
    // given
    const formValues = {
      startDate: moment('2021-05-15').toDate(),
      endDate: moment('2021-05-16').toDate(),
    };
    const period: Partial<Period> = {
      startDate: moment(formValues.startDate),
      endDate: moment(formValues.endDate),
    };
    periodsServiceSpy.create.and.returnValue(of(void 0));

    // when
    formComponent.form.setValue(formValues);
    formComponent.onSubmit();

    // then
    expect(periodsServiceSpy.create).toHaveBeenCalledWith(period);
    expect(periodsServiceSpy.update).not.toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalled();
  });

  it('should call update if router param defined', async () => {
    // given
    const periodId = 'p1';
    const periodPartial = {
      startDate: moment(moment('2021-05-15').toDate()), // hack to make moment equal moment in toHaveBeenCalledWith
      endDate: moment(moment('2021-05-16').toDate()), // hack to make moment equal moment in toHaveBeenCalledWith
    };
    const period: Period = {
      objectType: 'PERIOD',
      ...periodPartial,
      id: periodId,
    };
    periodsServiceSpy.read.and.returnValue(of(period));
    periodsServiceSpy.update.and.returnValue(of(void 0));

    // when
    activatedRoute.snapshot.params['id'] = periodId;
    formComponent.ngOnInit();
    formComponent.onSubmit();

    // then
    expect(periodsServiceSpy.create).not.toHaveBeenCalled();
    expect(periodsServiceSpy.update).toHaveBeenCalledWith(periodId, periodPartial);
    expect(routerSpy.navigate).toHaveBeenCalled();
  });
});
