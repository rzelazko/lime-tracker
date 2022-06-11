import { TestBed } from '@angular/core/testing';
import { User } from 'firebase/auth';
import * as moment from 'moment';
import { of } from 'rxjs';
import { MockFirebaseUser } from '../models/mock-firebase-user.model';
import { Period } from '../models/period.model';
import { PeriodInternal } from './../models/period.model';
import { AuthService } from './auth.service';
import { FirestoreService } from './firestore.service';
import { PeriodService } from './period.service';

describe('PeriodService', () => {
  let service: PeriodService;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let firestoreServiceSpy: jasmine.SpyObj<FirestoreService>;

  beforeEach(() => {
    const authServiceSpyObj = jasmine.createSpyObj('AuthService', ['user']);
    const firestoreServiceSpyObj = jasmine.createSpyObj('FirestoreService', ['add']);

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authServiceSpyObj },
        { provide: FirestoreService, useValue: firestoreServiceSpyObj },
      ],
    });
    service = TestBed.inject(PeriodService);
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
      startDate: moment('2021-05-15'),
    };
    const periodIntrnal: Partial<PeriodInternal> = {
      startDate: period.startDate
    };
    const mockUser: User = new MockFirebaseUser('Joanna Smith', 'joanna.smith@webperfekt.pl', 'joanna.smith');
    authServiceSpy.user.and.returnValue(mockUser);
    firestoreServiceSpy.add.and.returnValue(of());

    // when
    service.create(period);

    // then
    expect(firestoreServiceSpy.add).toHaveBeenCalledWith('users/joanna.smith/periods', periodIntrnal);
  });
});
