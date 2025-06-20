import { Component, inject, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApexNonAxisChartSeries, ApexChart, ApexResponsive, ApexLegend } from 'ng-apexcharts';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { ChartData } from './../../../../shared/models/chart-data.model';
import { ChartSeizuresByTypeService } from './../../../../shared/services/chart-seizures-by-type.service';

@Component({
  selector: 'app-chart-seizures-by-type',
  templateUrl: './chart-seizures-by-type.component.html',
  styleUrls: ['./chart-seizures-by-type.component.scss'],
  standalone: false
})
export class ChartSeizuresByTypeComponent implements OnInit {
  @Input() titleOffset: number = 0;
  chartOptions$?: Observable<any>;
  chartError$?: Observable<string>;

  private chartService: ChartSeizuresByTypeService = inject(ChartSeizuresByTypeService);
  private activatedRoute: ActivatedRoute = inject(ActivatedRoute);

  ngOnInit(): void {
    this.chartOptions$ = this.activatedRoute.params.pipe(
      map((routeParams): number | undefined => routeParams['year']),
      switchMap((selectedYear) => {
        this.chartService.setYear(selectedYear);
        return this.chartService.seizureSerie();
      }),
      map((data: ChartData) => this.toChartOptions(data))
    );

    this.chartError$ = this.chartOptions$.pipe(
      catchError((error) => of($localize`:@@error-message:Error: ${error.message || error}`))
    );
  }

  private toChartOptions(data: ChartData) {
    return {
      chart: {
        type: 'pie',
        width: '100%',
        height: 340,
      } as ApexChart,
      labels: data.data.map(d => d.x),
      series: data.data.map(d => d.y) as ApexNonAxisChartSeries,
      legend: {
        position: 'bottom',
        show: true,
        itemMargin: { horizontal: 8, vertical: 4 },
        floating: false,
        markers: { width: 12, height: 12 },
      } as ApexLegend,
      title: {
        text: $localize`:@@chart-seizures-by-type-title:Seizure types`,
        align: 'left',
        offsetX: this.titleOffset,
      },
      responsive: [
        {
          breakpoint: 600,
          options: {
            chart: {
              height: 260,
            },
            legend: {
              fontSize: '12px',
              itemMargin: { horizontal: 4, vertical: 2 },
              width: 280,
              height: 80,
            }
          }
        }
      ]
    };
  }
}
