import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatToolbarModule } from '@angular/material/toolbar';
import { User } from 'firebase/auth';
import { MockFirebaseUser } from './../../../shared/models/mock-firebase-user.model';
import { AuthService } from './../../../shared/services/auth.service';
import { ManageProfileComponent } from './manage-profile.component';

describe('ManageProfileComponent', () => {
  let component: ManageProfileComponent;
  let fixture: ComponentFixture<ManageProfileComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    const authServiceSpyObj = jasmine.createSpyObj('AuthService', ['userData', 'user']);

    await TestBed.configureTestingModule({
      declarations: [ManageProfileComponent],
      providers: [{ provide: AuthService, useValue: authServiceSpyObj }],
      imports: [MatToolbarModule],
    }).compileComponents();

    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;

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
