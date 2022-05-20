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
import { Medication } from '../../../../shared/models/medication.model';
import { MedicationsService } from '../../../../shared/services/medications.service';
import { UsersService } from '../../../../shared/services/users.service';
import { MedicationsFormComponent } from './medications-form.component';

describe('MedicationsFormComponent', () => {
  let formComponent: MedicationsFormComponent;
  let medsServiceSpy: jasmine.SpyObj<MedicationsService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let activatedRoute: ActivatedRoute;

  let fixture: ComponentFixture<MedicationsFormComponent>;

  beforeEach(async () => {
    const medicationsServiceSpyObj = jasmine.createSpyObj('MedicationsService', ['create', 'read', 'update']);
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);
    const activatedRouteMockObj = { snapshot: { params: {} } };

    await TestBed.configureTestingModule({
      declarations: [MedicationsFormComponent],
      providers: [
        { provide: MedicationsService, useValue: medicationsServiceSpyObj },
        { provide: Router, useValue: routerSpyObj },
        { provide: ActivatedRoute, useValue: activatedRouteMockObj },
        UsersService,
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
    medsServiceSpy = TestBed.inject(MedicationsService) as jasmine.SpyObj<MedicationsService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    activatedRoute = TestBed.inject(ActivatedRoute);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MedicationsFormComponent);
    formComponent = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(formComponent).toBeTruthy();
  });

  it('should have valid initial values', () => {
    // given
    const formValues = {
        name: '',
        doseMorning: '',
        doseNoon: '',
        doseEvening: '',
        startDate: '',
        archived: false,
        endDate: '',
      };

    // when
    const form = formComponent.form;

    // then
    expect(form.value).toEqual(formValues);
  });

  it('should not have required endDate if not archived', () => {
    // given
    const formValues = {
      name: '',
      doseMorning: '',
      doseNoon: '',
      doseEvening: '',
      startDate: '',
      archived: false,
      endDate: '',
    };

    // when
    formComponent.form.setValue(formValues);

    // then
    expect(formComponent.form.get('endDate')?.errors).toBeNull();
  });

  it('should have required endDate if archived', () => {
    // given
    const formValues = {
      name: '',
      doseMorning: '',
      doseNoon: '',
      doseEvening: '',
      startDate: '',
      archived: true,
      endDate: '',
    };

    // when
    formComponent.form.setValue(formValues);

    // then
    expect(formComponent.form.get('endDate')?.errors).not.toBeNull();
    expect((formComponent.form.get('endDate')?.errors as ValidationErrors)['required']).toBeTruthy();
  });

  it('should fail if endDate is before startDate', () => {
    // given
    const formValues = {
      name: '',
      doseMorning: '',
      doseNoon: '',
      doseEvening: '',
      startDate: moment('2021-05-15').toDate(),
      archived: true,
      endDate: moment('2021-05-14').toDate(),
    };

    // when
    formComponent.form.setValue(formValues);

    // then
    expect(formComponent.form.get('endDate')?.errors).not.toBeNull();
    expect((formComponent.form.get('endDate')?.errors as ValidationErrors)['isBefore']).toBeTruthy();
  });

  it('should convert form data into Medication object on submit', async () => {
    // given
    const formValues = {
      name: 'Test Medication',
      doseMorning: '125',
      doseNoon: '75',
      doseEvening: '250',
      startDate: moment('2021-05-15').toDate(),
      archived: true,
      endDate: moment('2021-05-16').toDate(),
    };
    const medication: Partial<Medication> = {
      name: formValues.name,
      doses: {
        morning: +formValues.doseMorning,
        noon: +formValues.doseNoon,
        evening: +formValues.doseEvening,
      },
      startDate: moment(formValues.startDate),
      archived: formValues.archived,
      endDate: moment(formValues.endDate),
    };
    medsServiceSpy.create.and.returnValue(of(void 0));

    // when
    formComponent.form.setValue(formValues);
    formComponent.onSubmit();

    // then
    expect(medsServiceSpy.create).toHaveBeenCalledWith(medication);
    expect(medsServiceSpy.update).not.toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalled();
  });

  it('should call update if router param defined', async () => {
    // given
    const medId = 'm1';
    const medicationPartial = {
      name: 'Test Medication',
      doses: {
        morning: 125,
        noon: 0,
        evening: 125
      },
      startDate: moment(moment('2021-05-15').toDate()), // hack to make moment equal moment in toHaveBeenCalledWith
      archived: true,
      endDate: moment(moment('2021-05-16').toDate()), // hack to make moment equal moment in toHaveBeenCalledWith
    };
    const medication: Medication = {
      ...medicationPartial,
      id: medId
    };
    medsServiceSpy.read.and.returnValue(of(medication));
    medsServiceSpy.update.and.returnValue(of(void 0));

    // when
    activatedRoute.snapshot.params['id'] = medId;
    formComponent.ngOnInit();
    formComponent.onSubmit();

    // then
    expect(medsServiceSpy.create).not.toHaveBeenCalled();
    expect(medsServiceSpy.update).toHaveBeenCalledWith(medId, medicationPartial);
    expect(routerSpy.navigate).toHaveBeenCalled();
  });
});
