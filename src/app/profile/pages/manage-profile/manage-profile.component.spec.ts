import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { User } from 'firebase/auth';
import { MockFirebaseUser } from './../../../shared/models/mock-firebase-user.model';
import { AuthService } from './../../../shared/services/auth.service';
import { UserDetailsService } from './../../../shared/services/user-details.service';
import { ManageProfileComponent } from './manage-profile.component';

describe('ManageProfileComponent', () => {
  let component: ManageProfileComponent;
  let fixture: ComponentFixture<ManageProfileComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let userDetailsServiceObj: jasmine.SpyObj<UserDetailsService>;

  beforeEach(async () => {
    const authServiceSpyObj = jasmine.createSpyObj('AuthService', ['user']);
    const userDetailsServiceSpyObj = jasmine.createSpyObj('UserDetailsService', ['get']);

    await TestBed.configureTestingModule({
      declarations: [ManageProfileComponent],
      providers: [
        { provide: AuthService, useValue: authServiceSpyObj },
        { provide: UserDetailsService, useValue: userDetailsServiceSpyObj },
      ],
      imports: [
        MatToolbarModule,
        MatProgressSpinnerModule,
        NoopAnimationsModule,
        MatSlideToggleModule,
      ],
    }).compileComponents();

    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    userDetailsServiceObj = TestBed.inject(
      UserDetailsService
    ) as jasmine.SpyObj<UserDetailsService>;

    const mockUser: User = new MockFirebaseUser(
      'Joanna Smith',
      'joanna.smith@webperfekt.pl',
      'joanna.smith'
    );
    authServiceSpy.user.and.returnValue(mockUser);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
