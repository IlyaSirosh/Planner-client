import {AfterViewInit, Component, ElementRef, OnInit, QueryList, Renderer2, ViewChild, ViewChildren} from '@angular/core';
import {PlanningDay} from '../domain/planning-day';
import {ActivatedRoute, Router} from '@angular/router';
import {PlanningService} from '../planning.service';
import {map, mergeMap, switchMap, tap} from 'rxjs/internal/operators';
import {PlanningMonth} from '../domain/planning-month';
import {forkJoin, ReplaySubject} from 'rxjs';


@Component({
  selector: 'planning-day',
  templateUrl: './day.component.html',
  styleUrls: ['./day.component.css']
})
export class DayComponent implements OnInit, AfterViewInit {

  private monthDate = new ReplaySubject(1);
  public $monthDate = this.monthDate.asObservable();

  day: PlanningDay;
  month: PlanningMonth;
  constructor(private renderer: Renderer2, private elem: ElementRef,
              private router: Router, private route: ActivatedRoute,
              private planningService: PlanningService) {
  }

  ngOnInit() {
    this.route.params
      .pipe(
      map(params => {
              let result = null;

              if (+params.year && +params.month && +params.day) {
                result = new Date( +params.year, (+params.month) - 1, +params.day);
              } else {
                result = this.planningService.getCurrentDate();
              }

              return result;
            }),
        tap((date: Date) => this.monthDate.next(date)),
        switchMap((date: Date) => this.planningService.getDay(date)),
    ).subscribe((day) => {
      this.day = day;
    });

    this.$monthDate
      .pipe(
        switchMap((date: Date) => this.planningService.getMonth(date)
        ) )
      .subscribe((month: PlanningMonth) => {
        this.month = month;
      });
  }

  ngAfterViewInit() {

  }

  goMonthView(month: Date): void {
    this.router.navigate(['/planning', month.getFullYear(), month.getMonth() + 1]);
  }

  prevMonth(): void {
    const prev = this.planningService.getPrevMonthDate(this.month.date);
    this.monthDate.next(prev);
  }

  nextMonth(): void {
    const next = this.planningService.getNextMonthDate(this.month.date);
    this.monthDate.next(next);
  }

  selectedDay(date: Date): void {
    this.router.navigate(['/planning', date.getFullYear(), date.getMonth() + 1, date.getDate()]);
  }

  onCurrentMonth(): void {
    const current = this.planningService.getCurrentMonthDate();
    const today = this.planningService.getCurrentDate();
    this.selectedDay(today);
    this.monthDate.next(current);
  }

  prevDay(): void {
    const nextDate = this.planningService.getPrevDayDate(this.day.date);
    this.selectedDay(nextDate);
  }

  nextDay(): void {
    const nextDate = this.planningService.getNextDayDate(this.day.date);
    this.selectedDay(nextDate);
  }
}
