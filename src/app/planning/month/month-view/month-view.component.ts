import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {PlanningMonth} from '../../domain/planning-month';

@Component({
  selector: 'app-month-view',
  templateUrl: './month-view.component.html',
  styleUrls: ['./month-view.component.css']
})
export class MonthViewComponent implements OnInit {

  constructor(private elem: ElementRef){}

  @Input() month: PlanningMonth;
  @Output() next = new EventEmitter();
  @Output() prev = new EventEmitter();

  height: number;
  width: number;
  dayHeight: number;
  dayWidth: number;

  weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sut', 'Sun'];

  today = new Date(Date.now());

  ngOnInit() {
    this.month = PlanningMonth.MONTH;
    console.log(this.month);
    const rect = this.elem.nativeElement.getBoundingClientRect();
    this.height = rect.height;
    this.width = rect.width;
    this.dayHeight = this.height / 5;
    this.dayWidth = this.width / 7;
  }

  nextMonth(): void {
    this.next.emit(this.month);
  }


  prevMonth(): void {
    this.prev.emit(this.month);
  }
}
