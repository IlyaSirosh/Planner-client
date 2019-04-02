import {Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2} from '@angular/core';
import {PlanningMonthPreview} from '../../domain/planning-month';
import {PlanningDayPreview} from '../../domain/planning-day';
import {WeekDay} from '@angular/common';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {

  @Input() month: PlanningMonthPreview;
  @Input() currentDay: PlanningDayPreview;
  @Output() nextMonth = new EventEmitter<Date>();
  @Output() daySelected = new EventEmitter<Date>();
  @Output() monthView = new EventEmitter<any>();

  nodes: WeekDayNode[];
  weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sut', 'Sun'];
  constructor(private elem: ElementRef, private renderer: Renderer2) { }

  ngOnInit() {
    const rect = this.elem.nativeElement.getBoundingClientRect();
    const width = rect.width;
    const height = width * 0.80;
    this.renderer.setStyle(this.elem.nativeElement, 'height', `${height}px`);

    this.month = PlanningMonthPreview.MONTH;
    this.groupDays();
  }

  private groupDays(): void {
    const temp = this.groupBy(this.month.days, (d: PlanningDayPreview) => {
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
    console.log(this.nodes);
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

  isNotCurrentMonth(date: Date): boolean {
    const current = this.month.date;
    return !(current.getMonth() === date.getMonth() && current.getFullYear() === date.getFullYear());
  }

  isWeekend(date: Date): boolean {
    return date.getDay() === 0 || date.getDay() === 6;
  }

  onNextMonth(): void {
    // TODO compute next month

    this.nextMonth.emit(null);
  }

  onPrevMonth(): void {
    // TODO compute previous month
    this.nextMonth.emit(null);
  }

  onDaySelected(day: PlanningDayPreview): void {
    this.daySelected.emit(day.date);
  }

  onTodaySelected(): void {
    const today = new Date(Date.now());
    this.nextMonth.emit(new Date(today.getFullYear(), today.getMonth(), today.getDate()));
  }

  goMonthView(): void {
    this.monthView.emit(this.month);
  }

}

class WeekDayNode {
  weekDay: string;
  daysOfMonth: PlanningDayPreview[];
}
