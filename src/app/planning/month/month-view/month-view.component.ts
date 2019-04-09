import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import { PlanningMonth} from '../../domain/planning-month';

@Component({
  selector: 'app-month-view',
  templateUrl: './month-view.component.html',
  styleUrls: ['./month-view.component.css']
})
export class MonthViewComponent implements OnInit {

  constructor(private elem: ElementRef){}

  @Input() month: PlanningMonth;
  @Output() nextMonth = new EventEmitter();
  @Output() prevMonth = new EventEmitter();
  @Output() selectedDay = new EventEmitter();

  height: number;
  width: number;
  dayHeight: number;
  dayWidth: number;

  weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sut', 'Sun'];

  today = new Date(Date.now());

  ngOnInit() {
    const rect = this.elem.nativeElement.getBoundingClientRect();
    this.height = rect.height;
    this.width = rect.width;
    this.dayHeight = this.height / 6;
    this.dayWidth = this.width / 7;
  }

  onNextMonth(): void {
    this.nextMonth.emit(this.month);
  }


  onPrevMonth(): void {
    this.prevMonth.emit(this.month);
  }

  onDaySelected(day): void {
    this.selectedDay.emit(day);
  }
}
