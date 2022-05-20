import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatError, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { of, throwError } from 'rxjs';
import { Event } from '../../../../shared/models/event.model';
import { EventsService } from '../../../../shared/services/events.service';
import { UsersService } from '../../../../shared/services/users.service';
import { EventsFormComponent } from './events-form.component';

describe('EventsFormComponent', () => {
  let formComponent: EventsFormComponent;
  let eventsServiceSpy: jasmine.SpyObj<EventsService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let activatedRoute: ActivatedRoute;

  let fixture: ComponentFixture<EventsFormComponent>;

  beforeEach(async () => {
    const eventsServiceSpyObj = jasmine.createSpyObj('EventsService', ['create', 'read', 'update']);
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);
    const activatedRouteMockObj = { snapshot: { params: {} } };

    await TestBed.configureTestingModule({
      declarations: [EventsFormComponent],
      providers: [
        { provide: EventsService, useValue: eventsServiceSpyObj },
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
    eventsServiceSpy = TestBed.inject(EventsService) as jasmine.SpyObj<EventsService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    activatedRoute = TestBed.inject(ActivatedRoute);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventsFormComponent);
    formComponent = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(formComponent).toBeTruthy();
  });

  it('should call update if router param defined', async () => {
    // given
    const eventId = 'e1';
    const eventPartial = {
      name: 'Test Event',
      occurred: moment(moment('2021-05-15').toDate()), // hack to make moment equal moment in toHaveBeenCalledWith
    };
    const event: Event = {
      ...eventPartial,
      id: eventId,
    };
    eventsServiceSpy.read.and.returnValue(of(event));
    eventsServiceSpy.update.and.returnValue(of(void 0));

    // when
    activatedRoute.snapshot.params['id'] = eventId;
    formComponent.ngOnInit();
    formComponent.onSubmit();

    // then
    expect(eventsServiceSpy.create).not.toHaveBeenCalled();
    expect(eventsServiceSpy.update).toHaveBeenCalledWith(eventId, eventPartial);
    expect(routerSpy.navigate).toHaveBeenCalled();
  });

  it('should display error if create fails', () => {
    const errorMsg = 'Some error!';
    eventsServiceSpy.create.and.returnValue(throwError(() => new Error(errorMsg)));

    // when
    formComponent.onSubmit();
    fixture.detectChanges();

    // then
    const matError = fixture.debugElement.query(By.directive(MatError));
    expect(matError).toBeTruthy();
    expect(matError.nativeElement.textContent).toContain(errorMsg);
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });
});
