import {AfterViewInit, Component, ElementRef, OnInit, QueryList, Renderer2, ViewChild, ViewChildren} from '@angular/core';
import {Task} from '../domain/task';
import {DayTimeRangeComponent} from './day-time-range/day-time-range.component';
import {DayTaskComponent} from '../day-task/day-task.component';
import {PlanningDay} from '../domain/planning-day';
import {ActivatedRoute, Router} from '@angular/router';
import {PlanningService} from '../planning.service';
import {PlanningMonth} from '../domain/planning-month';


@Component({
  selector: 'planning-day',
  templateUrl: './day.component.html',
  styleUrls: ['./day.component.css']
})
export class DayComponent implements OnInit, AfterViewInit {

  day: PlanningDay;
  month: PlanningMonth;
  constructor(private renderer: Renderer2, private elem: ElementRef,
              private router: Router, private route: ActivatedRoute, private planningService: PlanningService) {
    this.month = this.planningService.getCurrentMonth();
    this.day = this.planningService.getCurrentDay();
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (+params.year && +params.month && +params.day) {
        const date = new Date( +params.year, (+params.month) - 1, +params.day);
        const oldDate = this.day.date;
        this.day = this.planningService.getDay(date);

        if (date.getMonth() !== oldDate.getMonth() || date.getFullYear() !== oldDate.getFullYear()) {
          this.month = this.planningService.getMonth(date);
        }
      } else {
        this.day = this.planningService.getCurrentDay();
        this.month = this.planningService.getCurrentMonth();
      }
    });
  }

  ngAfterViewInit() {

  }

  goMonthView(month: Date): void {
    this.router.navigate(['/planning', month.getFullYear(), month.getMonth() + 1]);
  }

  prevMonth(): void {
    const next = this.planningService.getPrevMonth(this.month.date);
    this.month = this.planningService.getMonth(next);
  }

  nextMonth(): void {
    const next = this.planningService.getNextMonth(this.month.date);
    this.month = this.planningService.getMonth(next);
  }

  selectedDay(date: Date): void {
    this.router.navigate(['/planning', date.getFullYear(), date.getMonth() + 1, date.getDate()]);
  }

  onCurrentMonth(): void {
    this.month = this.planningService.getCurrentMonth();
  }

  prevDay(): void {
    const nextDate = this.planningService.getPrevDay(this.day.date);
    this.selectedDay(nextDate);
  }

  nextDay(): void {
    const nextDate = this.planningService.getNextDay(this.day.date);
    this.selectedDay(nextDate);
  }
}
