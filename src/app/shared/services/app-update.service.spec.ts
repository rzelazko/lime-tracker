import { ApplicationRef } from '@angular/core';
import { TestBed, fakeAsync, flushMicrotasks, tick } from '@angular/core/testing';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SwUpdate } from '@angular/service-worker';
import { BehaviorSubject, Subject } from 'rxjs';
import { UpdateDialogComponent } from './../components/update-dialog/update-dialog.component';
import { AppUpdateService } from './app-update.service';

describe('AppUpdateService', () => {
  let service: AppUpdateService;
  let appIsStable$: BehaviorSubject<boolean>;
  let afterClosed$: Subject<void>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<UpdateDialogComponent>>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;
  let swUpdateSpy: jasmine.SpyObj<SwUpdate>;

  beforeEach(() => {
    jasmine.clock().install();

    appIsStable$ = new BehaviorSubject(false);
    afterClosed$ = new Subject<void>();
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    swUpdateSpy = jasmine.createSpyObj(
      'SwUpdate',
      ['checkForUpdate', 'activateUpdate'],
      { unrecoverable: new Subject() }
    );

    dialogRefSpy.afterClosed.and.returnValue(afterClosed$);
    dialogSpy.open.and.returnValue(dialogRefSpy);
    swUpdateSpy.checkForUpdate.and.resolveTo(false);
    swUpdateSpy.activateUpdate.and.resolveTo();

    TestBed.configureTestingModule({
      providers: [
        AppUpdateService,
        { provide: ApplicationRef, useValue: { isStable: appIsStable$ } },
        { provide: SwUpdate, useValue: swUpdateSpy },
        { provide: MatDialog, useValue: dialogSpy },
      ],
    });

    service = TestBed.inject(AppUpdateService);
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('checks for update after the app becomes stable', fakeAsync(() => {
    service.checkForUpdate();

    expect(swUpdateSpy.checkForUpdate).not.toHaveBeenCalled();

    appIsStable$.next(true);
    flushMicrotasks();

    expect(swUpdateSpy.checkForUpdate).toHaveBeenCalledTimes(1);
  }));

  it('checks again when the app becomes visible', fakeAsync(() => {
    service.checkForUpdate();
    appIsStable$.next(true);
    flushMicrotasks();

    swUpdateSpy.checkForUpdate.calls.reset();
    tick(61_000);
    spyOnProperty(document, 'visibilityState', 'get').and.returnValue('visible');

    document.dispatchEvent(new Event('visibilitychange'));
    flushMicrotasks();

    expect(swUpdateSpy.checkForUpdate).toHaveBeenCalledTimes(1);
  }));

  it('opens the update dialog only once until it is closed', fakeAsync(() => {
    swUpdateSpy.checkForUpdate.and.resolveTo(true);
    spyOn(service, 'doAppUpdate');

    service.checkForUpdate();
    appIsStable$.next(true);
    flushMicrotasks();

    expect(dialogSpy.open).toHaveBeenCalledTimes(1);

    tick(61_000);
    window.dispatchEvent(new Event('focus'));
    flushMicrotasks();

    expect(dialogSpy.open).toHaveBeenCalledTimes(1);

    afterClosed$.next();
    flushMicrotasks();

    expect(service.doAppUpdate).toHaveBeenCalledTimes(1);
  }));
});
