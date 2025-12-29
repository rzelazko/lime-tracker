import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ChartSeizuresByLengthService } from './../../../../shared/services/chart-seizures-by-length.service';
import { ChartSeizuresByLengthComponent } from './chart-seizures-by-length.component';

// Mock service
class MockChartSeizuresByLengthService {
  setYear() {}
  subtitle() { return 'subtitle'; }
  seizureSerie() { return of({ data: [ { x: '0-1', y: 2 }, { x: '1-2', y: 1 } ] }); }
}

describe('ChartSeizuresByLengthComponent', () => {
  let component: ChartSeizuresByLengthComponent;
  let fixture: ComponentFixture<ChartSeizuresByLengthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChartSeizuresByLengthComponent],
      providers: [
        { provide: ChartSeizuresByLengthService, useClass: MockChartSeizuresByLengthService },
        { provide: ActivatedRoute, useValue: { params: of({ year: '2021' }) } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ChartSeizuresByLengthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set chartOptions$', (done) => {
    component.chartOptions$?.subscribe(options => {
      if (options) {
        expect(options.xaxis.categories).toEqual(['0-1', '1-2']);
        expect(options.series[0].data).toEqual([2, 1]);
      }
      done();
    });
  });

  it('should handle error', (done) => {
    const service = TestBed.inject(ChartSeizuresByLengthService);
    spyOn(service, 'seizureSerie').and.returnValue(throwError(() => new Error('fail')));
    component.ngOnInit();
    component.chartError$?.subscribe(error => {
      expect(error).toContain('fail');
      done();
    });
  });
});
