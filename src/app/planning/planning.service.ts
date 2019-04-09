import { Injectable } from '@angular/core';
import {Task} from './domain/task';
import {BehaviorSubject} from 'rxjs';
import {PlanningMonth} from './domain/planning-month';
import {TaskService} from './task.service';
import * as Moment from 'moment';
import { extendMoment } from 'moment-range';
const moment = extendMoment(Moment);
import {PlanningDay} from './domain/planning-day';
import {Project} from './domain/project';



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


  private _days: PlanningDay[] = [];

  constructor(private taskService: TaskService) {
    const arr = [];
    for(let i = 0; i < 8; i++) {
      const project = new Project();
      project.name = 'Project ' + (i + 1);
      arr.push(project);
    }

    this._projects.next(arr);

  }


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
    return this.getMonth(date);
  }

  getMonth(date: Date): PlanningMonth {
    return this.mapMonth(date);
  }

  getNextMonth(date: Date): Date {
    return moment(date).add(1, 'months').toDate();
  }

  getPrevMonth(date: Date): Date {
    return moment(date).subtract(1, 'months').toDate();
  }


  // TODO make return Promise<PlanningDay>
  getDay(date: Date): PlanningDay {
    const day = this._days.find( d => moment(date).isSame(moment(d.date), 'day') );

    return day ? day : this.askForDay(date);
  }

  getCurrentDay(): PlanningDay {
    const date =  new Date(Date.now());
    return this.getDay(date);
  }

  getNextDay(date: Date): Date {
    return moment(date).add(1, 'days').toDate();
  }

  getPrevDay(date: Date): Date {
    return moment(date).subtract(1, 'days').toDate();
  }


  private askForDay(date: Date): PlanningDay {
    // TODO ask server for tasks on specific day
    const month = this.mapMonth(date);
    const day = month.days.find( d => moment(date).isSame(moment(d.date), 'day') );
    console.log(day);
    return day;
  }

  private mapMonth(date: Date): PlanningMonth {
    const month = new PlanningMonth();
    month.date = moment(date).startOf('month').toDate();
    const monthDuration = this.findMonth(date);
    month.days  = this.getDays(monthDuration);
    return month;
  }


  private findMonth(date: Date): {from: Date, to: Date} {
    let begin = moment(date).startOf('month');
    let end = moment(date).endOf('month');

    // begin = begin.subtract( (begin.day() + 6) % 7, 'days');
    // end = end.add( ( (7 - end.day())  % 7), 'days');

    begin = begin.startOf('isoWeek');
    end = end.endOf('isoWeek');

    const duration = end.diff(begin, 'week') + 1;

    if (duration < 5) {
      begin.subtract(1, 'weeks');
    }

    if (duration < 6) {
       end.add(1, 'weeks');
    }

    return {from: begin.toDate(), to: end.toDate()};
  }

  private getDays(interval: {from: Date, to: Date}): PlanningDay[] {
    const from = moment(interval.from);
    const to = moment(interval.to);
    let days = this._days.filter((day) => moment(day.date).isBetween(from, to, 'day', '[]'));
    if (days.length < 42) {
      if (days.length === 0) {
        const genDaysBefore = this.generateDays(interval.from, interval.to);
        this._days.unshift(...genDaysBefore);
        this.sortDays(this._days);
        this.askForTasks(from.toDate(), to.toDate());

      } else {
        // sort days by date
        this.sortDays(days);

        const firstDate = moment(days[0].date);
        if (from.isBefore(firstDate, 'day')) {
          const genDaysBefore = this.generateDays(from.toDate(), moment(firstDate).subtract(1, 'days').toDate());
          this.addDays(genDaysBefore);
          this.askForTasks(from.toDate(), moment(firstDate).subtract(1, 'days').endOf('day').toDate());
        }

        const lastDate = moment(days[days.length - 1].date);
        if (lastDate.isBefore(to, 'day')) {
          const genDaysBefore = this.generateDays(moment(lastDate).add(1, 'days').toDate(), to.toDate());
          this.addDays(genDaysBefore);
          this.askForTasks(moment(lastDate).add(1, 'days').startOf('day').toDate(),  to.toDate());
        }

      }

      days = this._days.filter((day) => moment(day.date).isBetween(from, to, 'day', '[]'));
    }

    return days;
  }

  private generateDays(from: Date, to: Date): PlanningDay[] {

    return Array.from(moment.range(from, to).by('days')).map(date => {
      const day = new PlanningDay();
      day.date = date.toDate();
      day.tasks = [];
      day.deadlines = [];
      return day;
    });

  }


  private askForTasks(from: Date, to: Date): void {
    const momentFrom = moment(from);
    const momentTo = moment(to);
    this.taskService.getTasks(from.getMilliseconds(), to.getMilliseconds()).subscribe((tasks: Task[]) => {
      const days = this._days.filter((day) => moment(day.date).isBetween(momentFrom, momentTo, 'day', '[]'));
      days.forEach((day) => {
        day.tasks = tasks.filter((t) => moment(day.date).isSame(moment(t.begin, 'day')));
        // TODO what to do with deadlines
      });
    });
  }

  private sortDays(list: PlanningDay[]): void {
    list.sort((a, b) => {
      const aMil: number = a.date.getMilliseconds();
      const bMil: number  = b.date.getMilliseconds();
      return Math.sign(aMil - bMil);
    } );
  }

  private addDays(list: PlanningDay[]): void {
    this._days.push(...list);
    this.sortDays(this._days);
  }
}

