import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Task} from '../../domain/task';

@Component({
  selector: 'app-day-plan',
  templateUrl: './day-plan.component.html',
  styleUrls: ['./day-plan.component.css']
})
export class DayPlanComponent implements OnInit {

  @Input() tasks: Task[];
  @Output() updateTasks = new EventEmitter<Task[]>();
  @Output() addTask = new EventEmitter<Task>();

  constructor() { }

  ngOnInit() {
  }

}
