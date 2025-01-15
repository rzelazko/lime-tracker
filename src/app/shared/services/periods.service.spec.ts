import { TestBed } from '@angular/core/testing';
import moment from 'moment';
import { of } from 'rxjs';
import { UserData } from 'src/app/auth/models/user-details.model';
import { Period, PeriodInternal } from './../models/period.model';
import { AuthService } from './auth.service';
import { FirestoreService } from './firestore.service';
import { PeriodsService } from './periods.service';
import { UserDetailsService } from './user-details.service';

describe('PeriodsService', () => {
  let service: PeriodsService;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let userDetailsServiceSpy: jasmine.SpyObj<UserDetailsService>;
  let firestoreServiceSpy: jasmine.SpyObj<FirestoreService>;

  beforeEach(() => {
    const authServiceSpyObj = jasmine.createSpyObj('AuthService', [
      'userDetails$',
      'userIdProvider$'
    ]);
    const userDetailsServiceSpyObj = jasmine.createSpyObj('UserDetailsService', ['get']);
    const firestoreServiceSpyObj = jasmine.createSpyObj('FirestoreService', ['add']);

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authServiceSpyObj },
        { provide: UserDetailsService, useValue: userDetailsServiceSpyObj },
        { provide: FirestoreService, useValue: firestoreServiceSpyObj }
      ]
    });
    service = TestBed.inject(PeriodsService);
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    userDetailsServiceSpy = TestBed.inject(
      UserDetailsService
    ) as jasmine.SpyObj<UserDetailsService>;
    firestoreServiceSpy = TestBed.inject(FirestoreService) as jasmine.SpyObj<FirestoreService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call valid collection and add internal object on create', () => {
    // given
    const period: Partial<Period> = {
      objectType: 'PERIOD',
      startDate: moment('2021-05-15')
    };
    const periodIntrnal: Partial<PeriodInternal> = {
      startDate: period.startDate
    };
    const mockUserData: UserData = {
      id: 'joanna.smith',
      name: 'Joanna Smith',
      email: 'joanna.smith@webperfekt.pl',
      seizureTriggers: [],
      seizureTypes: [],
      isFemale: true
    };
    authServiceSpy.userDetails$.and.returnValue(of(mockUserData));
    authServiceSpy.userIdProvider$.and.returnValue(of(mockUserData.id));
    userDetailsServiceSpy.get.and.returnValue(of(mockUserData));
    firestoreServiceSpy.add.and.returnValue(of());

    // when
    service.create(period).subscribe();

    // then
    expect(firestoreServiceSpy.add).toHaveBeenCalledWith(
      'users/joanna.smith/periods',
      periodIntrnal
    );
  });
});
