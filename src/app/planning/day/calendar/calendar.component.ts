import {Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, Renderer2} from '@angular/core';
import {PlanningMonth} from '../../domain/planning-month';
import {PlanningDay} from '../../domain/planning-day';
import * as moment from 'moment';
@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit, OnChanges {

  @Input() month: PlanningMonth;
  @Input() currentDay: Date;

  @Output() nextMonth = new EventEmitter<Date>();
  @Output() prevMonth = new EventEmitter<Date>();
  @Output() daySelected = new EventEmitter<Date>();
  @Output() monthView = new EventEmitter<any>();
  @Output() today = new EventEmitter<any>();

  nodes: WeekDayNode[];
  weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sut', 'Sun'];
  constructor(private elem: ElementRef, private renderer: Renderer2) { }

  ngOnInit() {
    const rect = this.elem.nativeElement.getBoundingClientRect();
    const width = rect.width;
    const height = width * 0.80;
    this.renderer.setStyle(this.elem.nativeElement, 'min-height', `${height}px`);
  }

  ngOnChanges() {

    if (this.month) {
      this.groupDays();
    }
  }

  private groupDays(): void {
    const temp = this.groupBy(this.month.days, (d: PlanningDay) => {
      return d.date.getDay();
    });


    // make Monday the first day of week
    const sunday = temp.shift();
    temp.push(sunday);


    this.nodes = temp.map( (days, i) => {
      const n = new WeekDayNode();
      n.weekDay = this.weekDays[i];
      n.daysOfMonth = days;
      return n;
    });
  }

  private groupBy(xs, keyGetter) {
    return xs.reduce((rv, x) => {
      const key = keyGetter(x);
      (rv[key] = rv[key] || []).push(x);
      return rv;
    }, []);
  }

  isToday(date: Date): boolean {
    const today = new Date(Date.now());
    return today.getDate() === date.getDate() && today.getMonth() === date.getMonth() && today.getFullYear() === date.getFullYear();
  }

  isNotCurrentMonth(): boolean {
    const current = this.month.date;
    const today = new Date(Date.now());
    return !(current.getMonth() === today.getMonth() && current.getFullYear() === today.getFullYear());
  }

  isAnotherMonth(date: Date): boolean {
    const current = this.month.date;
    return !(current.getMonth() === date.getMonth() && current.getFullYear() === date.getFullYear());
  }

  isWeekend(date: Date): boolean {
    return date.getDay() === 0 || date.getDay() === 6;
  }

  onNextMonth(): void {
    this.nextMonth.emit(this.month.date);
  }

  onPrevMonth(): void {
    this.prevMonth.emit(this.month.date);
  }

  onDaySelected(day: PlanningDay): void {
    this.daySelected.emit(day.date);
  }

  onTodaySelected(): void {
    this.today.emit(null);
  }

  goMonthView(): void {
    this.monthView.emit(this.month.date);
  }

  isSelectedDay(date: Date): boolean {
    if (!this.currentDay) return false;
    return moment(this.currentDay).isSame(moment(date), 'day');
  }
}

class WeekDayNode {
  weekDay: string;
  daysOfMonth: PlanningDay[];
}
