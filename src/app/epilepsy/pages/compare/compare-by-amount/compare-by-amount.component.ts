import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  COMPARE_AMOUNT_MAX,
  COMPARE_AMOUNT_MIN,
} from '../compare.component';

@Component({
  selector: 'app-compare-by-amount',
  templateUrl: './compare-by-amount.component.html',
  styleUrl: './compare-by-amount.component.scss',
  standalone: false,
})
export class CompareByAmountComponent implements OnInit {
  private router: Router = inject(Router);
  private route: ActivatedRoute = inject(ActivatedRoute);

  by: 'month' | 'year' | null = null;
  amount: number | null = null;

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const by = params.get('by');
      const amount = params.get('amount');

      if (
        (by !== 'month' && by !== 'year') ||
        amount === null ||
        isNaN(+amount) ||
        +amount < COMPARE_AMOUNT_MIN ||
        +amount > COMPARE_AMOUNT_MAX
      ) {
        const url = $localize`:@@routerLink-epilepsy-compare:/epilepsy/compare`;
        this.router.navigate([url]);
      } else {
        this.by = by;
        this.amount = +amount;
      }
    });
  }
}
