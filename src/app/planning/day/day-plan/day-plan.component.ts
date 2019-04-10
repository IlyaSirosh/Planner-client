import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Task, TaskList} from '../../domain/task';
import {PlanningDay} from '../../domain/planning-day';
import {PlanningService} from '../../planning.service';
import {FormsService} from '../../forms/forms.service';


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
  constructor(private planningService: PlanningService, private formService: FormsService) { }

  ngOnInit() {
  }

  onPrevDay(): void {
    this.prevDay.emit(null);
  }

  onNextDay(): void {
    this.nextDay.emit(null);
  }

  edit(task: Task, event): void {
    this.formService.openTaskForm(task, event, (result) => {
      this.planningService.updateTask(task, TaskList.PLANNED);
    });
  }

  moveToArchive(task: Task): void {
    this.planningService.moveTask(task, TaskList.PLANNED, TaskList.ARCHIVE);
  }

  moveToWaitingList(task: Task): void {
    this.planningService.moveTask(task, TaskList.PLANNED, TaskList.WAITING);
  }

  drop(event): void {
    console.log(event);
    const task = event.item.data as Task;
    task.begin = this.day.date;
    task.begin.setHours(12, 30);
    this.planningService.moveTask(task, TaskList[event.previousContainer.id], TaskList[event.container.id], event);

    console.log(task);
  }
}
