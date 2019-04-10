import {Component, OnDestroy, OnInit} from '@angular/core';
import {PlanningMonth} from '../domain/planning-month';
import {PlanningService} from '../planning.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'planning-month',
  templateUrl: './month.component.html',
  styleUrls: ['./month.component.css']
})
export class MonthComponent implements OnInit, OnDestroy {

  month: PlanningMonth;
  sub;
  constructor(private planningService: PlanningService, private router: Router, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      if (+params.year && +params.month) {
        const date = new Date( +params.year, (+params.month) - 1, 1); // (+) converts string 'id' to a number
        this.month = this.planningService.getMonth(date);
      } else {
        this.month = this.planningService.getCurrentMonth();
      }
    });

  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  nextMonth(): void {

    const nextMonth = this.planningService.getNextMonth(this.month.date);
    this.router.navigate(['/planning', nextMonth.getFullYear(), nextMonth.getMonth() + 1]);
  }

  prevMonth(): void {
    const prevMonth = this.planningService.getPrevMonth(this.month.date);
    this.router.navigate(['/planning', prevMonth.getFullYear(), prevMonth.getMonth() + 1]);
  }

  selectedDay(date: Date): void {
    this.router.navigate(['/planning', date.getFullYear(), date.getMonth() + 1,date. getDate() ]);
  }
}
