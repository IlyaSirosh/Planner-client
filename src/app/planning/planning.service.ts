import { Injectable } from '@angular/core';
import {Task} from './domain/task';
import {BehaviorSubject} from 'rxjs';
import {PlanningMonth} from './domain/planning-month';
import {TaskService} from './task.service';
import * as moment from 'moment';
import {PlanningDay} from './domain/planning-day';



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


  private _days: PlanningDay[];

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

  private _updateTask(task: Task): void {

  }

  getCurrentMonth(): PlanningMonth {
    const date =  new Date(Date.now());
    return this.mapMonth(date);
  }

  getNextMonth(month: PlanningMonth): PlanningMonth {
    const nextDate = moment(month.date).add(1, 'months').toDate();
    return this.mapMonth(nextDate);
  }

  getPrevMonth(month: PlanningMonth): PlanningMonth {
    const prevDate = moment(month.date).subtract(1, 'months').toDate();
    return this.mapMonth(prevDate);
  }

  private mapMonth(date: Date): PlanningMonth {
    const month = new PlanningMonth();
    month.date = date;
    const monthDuration = this.findMonth(date);
    month.days = this.getDays(monthDuration);
    return month;
  }


  private findMonth(date: Date): {from: Date, to: Date} {
    let begin = moment(date).startOf('month');
    let end = moment(date).endOf('month');

    // begin = begin.subtract( (begin.day() + 6) % 7, 'days');
    // end = end.add( ( (7 - end.day())  % 7), 'days');

    begin = begin.startOf('week');
    end = end.endOf('week');

    const duration = moment.duration(begin.diff(end)).weeks();

    if (duration < 6) {
      end = end.add(1, 'weeks');
    }

    return {from: begin.toDate(), to: end.toDate()};
  }

  private getDays(interval: {from: Date, to: Date}): PlanningDay[] {
    return [];
  }
}
