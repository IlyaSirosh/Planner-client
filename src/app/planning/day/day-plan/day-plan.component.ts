import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import {Task, TaskList} from '../../domain/task';
import {PlanningDay} from '../../domain/planning-day';
import {PlanningService} from '../../planning.service';
import {FormsService} from '../../forms/forms.service';
import {of} from 'rxjs';
import {skipUntil, switchMap} from 'rxjs/internal/operators';


@Component({
  selector: 'app-day-plan',
  templateUrl: './day-plan.component.html',
  styleUrls: ['./day-plan.component.css']
})
export class DayPlanComponent implements OnInit, OnChanges {

  @Input() date: Date;
  @Output() updateTasks = new EventEmitter<Task[]>();
  @Output() addTask = new EventEmitter<Task>();
  @Output() prevDay = new EventEmitter<any>();
  @Output() nextDay = new EventEmitter<any>();

  day: PlanningDay;

  constructor(private planningService: PlanningService, private formService: FormsService) { }

  ngOnInit() {
  }

  ngOnChanges() {
    of(this.date)
      .pipe(
        switchMap((date: Date) => this.planningService.getDay(date))
      )
      .subscribe((day: PlanningDay) => {
        this.day = day;
      });
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
    const task = {...event.item.data} as Task;
    task.begin = this.day.date;
    task.begin.setHours(12, 30);
    this.planningService.moveTask(task, TaskList[event.previousContainer.id as string], TaskList[event.container.id as string], event);

    console.log(task);
  }
}
