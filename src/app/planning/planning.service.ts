import { Injectable } from '@angular/core';
import {Task} from './domain/task';
import {BehaviorSubject} from 'rxjs';
import {PlanningMonth, PlanningMonthPreview} from './domain/planning-month';
import {TaskService} from './task.service';


@Injectable({
  providedIn: 'root'
})
export class PlanningService {


  private _waiting = new BehaviorSubject([]);
  public readonly $waitingList = this._waiting.asObservable();

  private _projects = new BehaviorSubject([]);
  public readonly $projects = this._projects.asObservable();

  private _archive = new BehaviorSubject([]);
  public readonly $archive = this._archive.asObservable();

  private _planned: PlanningMonth[];
  private _tasks: Task[];

  constructor(private taskService: TaskService) { }


  addTask(task: Task): void {
    this.taskService.create(task).toPromise()
      .then((t) => {
        this._addTask(t);
      })
      .catch(() => {});
  }

  private _addTask(task: Task): void {
    const arr = [...this._waiting.value];
    arr.unshift(task);
    this._waiting.next(arr);
  }

  updateTask(task: Task): void {

  }

  getCurrentMonth(): PlanningMonthPreview {
    const date =  Date.today();
    return this.mapMonth(date);
  }

  getNextMonth(date: Date): PlanningMonthPreview {
    return this.mapMonth(date.next().month());
  }

  getPrevMonth(date: Date): PlanningMonthPreview{
    return this.mapMonth(date.prev().month());
  }

  private mapMonth(date: Date): PlanningMonthPreview {

    const month = new PlanningMonthPreview();
    month.date = date;

    return null;
  }


  private findMonth(date: Date): {from: number, to: number} {
    const begin = date.first().day();
    const end = date.last().day();

    begin.addDays(-1 * (Math.abs(begin.getDay() + 6) % 7) );
    end.addDays( ( 7 - end.getDay() ) % 7);

    return {from: begin.getMilliseconds(), to: end.getMilliseconds()};
  }
}
