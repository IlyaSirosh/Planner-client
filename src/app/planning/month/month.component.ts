import {Component, OnDestroy, OnInit} from '@angular/core';
import {PlanningMonth} from '../domain/planning-month';
import {PlanningService} from '../planning.service';
import {ActivatedRoute, Router} from '@angular/router';
import {map, switchMap, tap} from 'rxjs/internal/operators';

@Component({
  selector: 'planning-month',
  templateUrl: './month.component.html',
  styleUrls: ['./month.component.css']
})
export class MonthComponent implements OnInit {

  month: PlanningMonth;
  constructor(private planningService: PlanningService, private router: Router, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.params.pipe(
      map(params => {
            if (+params.year && +params.month) {
              return new Date( +params.year, (+params.month) - 1, 1);
            } else {
              return this.planningService.getCurrentMonthDate();
            }
          }),
      tap(console.log),
      switchMap(date => this.planningService.getMonth(date))
    ).subscribe( month => this.month = month);

  }

  nextMonth(): void {

    const nextMonth = this.planningService.getNextMonthDate(this.month.date);
    this.router.navigate(['/planning', nextMonth.getFullYear(), nextMonth.getMonth() + 1]);
  }

  prevMonth(): void {
    const prevMonth = this.planningService.getPrevMonthDate(this.month.date);
    this.router.navigate(['/planning', prevMonth.getFullYear(), prevMonth.getMonth() + 1]);
  }

  selectedDay(date: Date): void {
    this.router.navigate(['/planning', date.getFullYear(), date.getMonth() + 1, date.getDate() ]);
  }
}
