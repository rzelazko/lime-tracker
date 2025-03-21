import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import moment from 'moment';
import { of } from 'rxjs';
import { UserData } from './../../../../auth/models/user-details.model';
import { UserDetailsService } from './../../../../shared/services/user-details.service';
import { Seizure } from './../../../../shared/models/seizure.model';
import { AuthService } from './../../../../shared/services/auth.service';
import { SeizuresService } from './../../../../shared/services/seizures.service';
import { SeizuresFormComponent } from './seizures-form.component';

describe('SeizuresFormComponent', () => {
  let formComponent: SeizuresFormComponent;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let userDetailsServiceSpy: jasmine.SpyObj<UserDetailsService>;
  let seizuresServiceSpy: jasmine.SpyObj<SeizuresService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let activatedRoute: ActivatedRoute;

  let fixture: ComponentFixture<SeizuresFormComponent>;

  const mockUserData: UserData = {
    id: 'joanna.smith',
    name: 'Joanna Smith',
    email: 'joanna.smith@webperfekt.pl',
    seizureTriggers: [],
    seizureTypes: [],
    isFemale: true
  };

  beforeEach(async () => {
    const seizuresServiceSpyObj = jasmine.createSpyObj('SeizuresService', ['create', 'update']);
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);
    const activatedRouteMockObj = { snapshot: { params: {} } };
    const authServiceSpyObj = jasmine.createSpyObj('AuthService', [
      'userDetails$',
      'userIdProvider$'
    ]);
    const userDetailsServiceSpyObj = jasmine.createSpyObj('UserDetailsService', ['get']);

    await TestBed.configureTestingModule({
      declarations: [SeizuresFormComponent],
      providers: [
        { provide: SeizuresService, useValue: seizuresServiceSpyObj },
        { provide: Router, useValue: routerSpyObj },
        { provide: ActivatedRoute, useValue: activatedRouteMockObj },
        { provide: AuthService, useValue: authServiceSpyObj },
        { provide: UserDetailsService, useValue: userDetailsServiceSpyObj }
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
        MatToolbarModule
      ]
    }).compileComponents();
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    userDetailsServiceSpy = TestBed.inject(
      UserDetailsService
    ) as jasmine.SpyObj<UserDetailsService>;
    seizuresServiceSpy = TestBed.inject(SeizuresService) as jasmine.SpyObj<SeizuresService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    activatedRoute = TestBed.inject(ActivatedRoute);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SeizuresFormComponent);
    formComponent = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(formComponent).toBeTruthy();
  });

  it('should convert form data into Seizure object on submit', async () => {
    // given
    authServiceSpy.userDetails$.and.returnValue(of(mockUserData));
    authServiceSpy.userIdProvider$.and.returnValue(of(mockUserData.id));
    const formValues = {
      occurred: moment('2021-08-09T10:20').format(SeizuresFormComponent.DATE_TIME_FORMAT),
      duration: 5,
      seizureType: 'seizure type 1',
      seizureTriggers: ['seizure trigger 1', 'seizure trigger 2']
    };
    const seizure: Partial<Seizure> = {
      occurred: moment(formValues.occurred),
      duration: moment.duration(formValues.duration, 'minutes'),
      type: formValues.seizureType,
      triggers: formValues.seizureTriggers
    };
    seizuresServiceSpy.create.and.returnValue(of(void 0));

    // when
    formComponent.form.setValue(formValues);
    formComponent.onSubmit();

    // then
    expect(seizuresServiceSpy.create).toHaveBeenCalledWith(seizure);
    expect(seizuresServiceSpy.update).not.toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalled();
  });
});
