import { TestBed } from '@angular/core/testing';
import moment from 'moment';
import { of } from 'rxjs';
import { UserData } from 'src/app/auth/models/user-details.model';
import { Period, PeriodInternal } from './../models/period.model';
import { AuthService } from './auth.service';
import { FirestoreService } from './firestore.service';
import { PeriodsService } from './periods.service';

describe('PeriodsService', () => {
  let service: PeriodsService;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let firestoreServiceSpy: jasmine.SpyObj<FirestoreService>;

  beforeEach(() => {
    const authServiceSpyObj = jasmine.createSpyObj('AuthService', ['userDetails$']);
    const firestoreServiceSpyObj = jasmine.createSpyObj('FirestoreService', ['add']);

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authServiceSpyObj },
        { provide: FirestoreService, useValue: firestoreServiceSpyObj }
      ]
    });
    service = TestBed.inject(PeriodsService);
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
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
      email: 'Joanna Smith',
      name: 'joanna.smith@webperfekt.pl',
      seizureTriggers: [],
      seizureTypes: [],
      isFemale: true
    };
    authServiceSpy.userDetails$.and.returnValue(of(mockUserData));
    firestoreServiceSpy.add.and.returnValue(of());

    // when
    service.create(period);

    // then
    expect(firestoreServiceSpy.add).toHaveBeenCalledWith(
      'users/joanna.smith/periods',
      periodIntrnal
    );
  });
});
