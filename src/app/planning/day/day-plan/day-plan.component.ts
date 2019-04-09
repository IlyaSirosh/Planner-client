import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Task} from '../../domain/task';
import {PlanningDay} from '../../domain/planning-day';


@Component({
  selector: 'app-day-plan',
  templateUrl: './day-plan.component.html',
  styleUrls: ['./day-plan.component.css']
})
export class DayPlanComponent implements OnInit {

  @Input() day: PlanningDay;
  @Output() updateTasks = new EventEmitter<Task[]>();
  @Output() addTask = new EventEmitter<Task>();
  @Output() prevDay = new EventEmitter<any>();
  @Output() nextDay = new EventEmitter<any>();
  constructor() { }

  ngOnInit() {
  }

  onPrevDay(): void {
    this.prevDay.emit(null);
  }

  onNextDay(): void {
    this.nextDay.emit(null);
  }
}
