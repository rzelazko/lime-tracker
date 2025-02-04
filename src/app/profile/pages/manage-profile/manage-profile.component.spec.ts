import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinner, MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggle, MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatToolbarModule } from '@angular/material/toolbar';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { User } from 'firebase/auth';
import { of } from 'rxjs';
import { UserData } from './../../../auth/models/user-details.model';
import { MockFirebaseUser } from './../../../shared/models/mock-firebase-user.model';
import { AuthService } from './../../../shared/services/auth.service';
import { UserDetailsService } from './../../../shared/services/user-details.service';
import { ManageProfileComponent } from './manage-profile.component';

describe('ManageProfileComponent', () => {
  let component: ManageProfileComponent;
  let fixture: ComponentFixture<ManageProfileComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let userDetailsServiceSpy: jasmine.SpyObj<UserDetailsService>;

  const mockUserData: UserData = {
    id: 'joanna.smith',
    name: 'Joanna Smith',
    email: 'joanna.smith@webperfekt.pl',
    seizureTriggers: [],
    seizureTypes: [],
    isFemale: true
  };

  const mockUser: User = new MockFirebaseUser(
    mockUserData.name,
    mockUserData.email,
    mockUserData.id
  );

  beforeEach(async () => {
    const authServiceSpyObj = jasmine.createSpyObj('AuthService', [
      'userDetails$',
      'userIdProvider$'
    ]);
    const userDetailsServiceSpyObj = jasmine.createSpyObj('UserDetailsService', ['setIsFemale']);

    await TestBed.configureTestingModule({
      declarations: [ManageProfileComponent],
      providers: [
        { provide: AuthService, useValue: authServiceSpyObj },
        { provide: UserDetailsService, useValue: userDetailsServiceSpyObj }
      ],
      imports: [
        MatToolbarModule,
        MatProgressSpinnerModule,
        NoopAnimationsModule,
        FormsModule,
        MatDividerModule,
        MatSlideToggleModule
      ]
    }).compileComponents();

    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    userDetailsServiceSpy = TestBed.inject(
      UserDetailsService
    ) as jasmine.SpyObj<UserDetailsService>;
  });

  it('should create', () => {
    // given
    authServiceSpy.userDetails$.and.returnValue(of(mockUserData));
    authServiceSpy.userIdProvider$.and.returnValue(of(mockUserData.id));

    // when
    fixture = TestBed.createComponent(ManageProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    // then
    expect(component).toBeTruthy();
  });

  it('should show loading spinner when user details not loaded', () => {
    // given
    authServiceSpy.userDetails$.and.returnValue(of());
    authServiceSpy.userIdProvider$.and.returnValue(of());

    // when
    fixture = TestBed.createComponent(ManageProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    // then
    const loadingSpinner = fixture.debugElement.queryAll(By.directive(MatProgressSpinner));
    expect(loadingSpinner.length).toBe(1);
  });

  it('should show selected name when user details loaded', () => {
    // given
    authServiceSpy.userDetails$.and.returnValue(of(mockUserData));
    authServiceSpy.userIdProvider$.and.returnValue(of(mockUserData.id));

    // when
    fixture = TestBed.createComponent(ManageProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    // then
    const titleElement = fixture.debugElement.query(By.css('h1'));
    expect(titleElement.nativeElement.textContent).toContain(mockUserData.name);
  });

  it('should toggle isFemale be checked when user detail is female', () => {
    // given
    const femaleData = { ...mockUserData, isFemale: true };
    authServiceSpy.userDetails$.and.returnValue(of(femaleData));
    authServiceSpy.userIdProvider$.and.returnValue(of(femaleData.id));

    // when
    fixture = TestBed.createComponent(ManageProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    // then
    const isFemaleToggle: MatSlideToggle = fixture.debugElement.query(
      By.directive(MatSlideToggle)
    ).componentInstance;
    expect(isFemaleToggle.checked).toBeTrue();
  });

  it('should toggle isFemale be unchecked when user detail is not female', () => {
    // given
    const maleData = { ...mockUserData, isFemale: false };
    authServiceSpy.userDetails$.and.returnValue(of(maleData));
    authServiceSpy.userIdProvider$.and.returnValue(of(maleData.id));

    // when
    fixture = TestBed.createComponent(ManageProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    // then
    const isFemaleToggle: MatSlideToggle = fixture.debugElement.query(
      By.directive(MatSlideToggle)
    ).componentInstance;
    expect(isFemaleToggle.checked).toBeFalse();
  });

  it('should trigger user details update on isFemale toggle change', () => {
    // given
    const isFemaleObservable$ = of(void 0);
    authServiceSpy.userDetails$.and.returnValue(of(mockUserData));
    authServiceSpy.userIdProvider$.and.returnValue(of(mockUserData.id));
    userDetailsServiceSpy.setIsFemale.and.returnValue(isFemaleObservable$);

    fixture = TestBed.createComponent(ManageProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const isFemaleToggle = fixture.debugElement.query(By.directive(MatSlideToggle));

    // when
    isFemaleToggle.triggerEventHandler('change', { checked: true });

    // then
    expect(userDetailsServiceSpy.setIsFemale).toHaveBeenCalled();
  });
});
