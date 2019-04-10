import { Injectable } from '@angular/core';
import {Task, TaskList} from './domain/task';
import {BehaviorSubject} from 'rxjs';
import {PlanningMonth} from './domain/planning-month';
import {TaskService} from './task.service';
import * as Moment from 'moment';
import { extendMoment } from 'moment-range';
const moment = extendMoment(Moment);
import {PlanningDay} from './domain/planning-day';
import {Project} from './domain/project';
import {ProjectService} from './project.service';
import {DayTimeRangeComponent} from './day/day-time-range/day-time-range.component';


@Injectable({
  providedIn: 'root'
})
export class PlanningService {

  timeRange: DayTimeRangeComponent;

  private _waiting = new BehaviorSubject<Task[]>([]);
  public readonly $waitingList = this._waiting.asObservable();

  private _projects = new BehaviorSubject<Project[]>([]);
  public readonly $projects = this._projects.asObservable();

  private _archive = new BehaviorSubject<Task[]>([]);
  public readonly $archive = this._archive.asObservable();


  private _days: PlanningDay[] = [];

  constructor(private taskService: TaskService, private projectService: ProjectService) {

    this.taskService.getWaitingTasks().subscribe( (tasks: Task[]) => {
      if (tasks) {
        const a: Task[] = this._waiting.value.concat(tasks) as Task[];
        this._waiting.next(a);
      }
    });

    this.projectService.getProjects().subscribe((projects: Project[]) => {
      if (projects) {
        const a: Project[] = this._projects.value.concat(projects) as Project[];
        this._projects.next(a);
        console.log(projects);
      }
    });

    this.taskService.getArchive().subscribe( (tasks: Task[]) => {
      if (tasks) {
        const a: Task[] = this._archive.value.concat(tasks) as Task[];
        this._archive.next(a);
      }
    });
  }


  addTask(task: Task, list: TaskList = TaskList.WAITING): void {
    this.taskService.create(task).toPromise()
      .then((t) => {
        if (list === TaskList.WAITING) {
          this._addTaskToWaiting(t);
        } else {
          this._addTaskToDay(t, event);
        }
      })
      .catch(() => {});
  }

  private _addTaskToWaiting(task: Task): void {
    const arr = [...this._waiting.value];
    arr.unshift(task);
    this._waiting.next(arr);

    if (task.project) {

      const projects = this._projects.value;
      const index = projects.findIndex(p => p.id === task.project.id);
      if (index < 0) {
        projects[index].tasks.unshift(task);
        this._projects.next(this._projects.value);
      }
    }
  }

  private _addTaskToDay(task: Task, event): void {
   const index = this._days.findIndex(d => moment(d.date).isSame(moment(task.begin), 'day'));

   if (index !== -1) {
     this._days[index].tasks.push(task);
   } else {
     const d = this.getDay(task.begin);
     d.tasks.push(task);
   }

    this.timeRange.addTask(task);
  }

  private _addTaskToArchive(task: Task): void {
    const arr = [...this._archive.value];
    arr.unshift(task);
    this._archive.next(arr);
  }

  updateTask(task: Task, list: TaskList = TaskList.WAITING): void {
    this.taskService.update(task).toPromise()
      .then(() => {

        if (list === TaskList.WAITING) {
          this._updateTask(task);
        } else if (list === TaskList.PLANNED) {
          this._updateDayTask(task);
        } else {
          this._updateArchiveTask(task);
        }

      })
      .catch(() => {});
  }

  moveTask(task: Task, from: TaskList, to: TaskList, event = null): void {
    console.log(task, from, to);
    task.list = to;
    this.taskService.update(task).toPromise()
      .then(() => {

        switch (from) {
          case TaskList.WAITING: {
            this._removeTaskFromWaiting(task);
            break;
          }
          case TaskList.PLANNED: {
            this._removeTaskFromDay(task);
            break;
          }
          case TaskList.ARCHIVE: {
            this._removeTaskFromArchive(task);
            break;
          }

        }

        switch (to) {
          case TaskList.WAITING: {
            this._addTaskToWaiting(task);
            break;
          }
          case TaskList.PLANNED: {
            this._addTaskToDay(task, event);
            break;
          }
          case TaskList.ARCHIVE: {
            this._addTaskToArchive(task);
            break;
          }

        }

      })
      .catch(() => {
        task.list = from;
      });



  }

  private _removeTaskFromWaiting(task: Task): void {
    const index = this._waiting.value.findIndex( t => t.id === task.id);

    if (index !== -1) {
      this._waiting.value.splice(index, 1);
      this._waiting.next(this._waiting.value);
    }

    if (task.project) {

      const projects = this._projects.value;
      const index2 = projects.findIndex(p => p.id === task.project.id);
      if (index2 !== -1) {
        const index3 = projects[index].tasks.findIndex(t => t.id === task.id);
        if (index3 !== -1) {
          projects[index].tasks.splice(index3, 1);
        }
      }
    }
  }

  private _removeTaskFromArchive(task: Task): void {
    const index = this._archive.value.findIndex( t => t.id === task.id);

    if (index !== -1) {
      this._archive.value.splice(index, 1)
      this._archive.next(this._archive.value);
    }
  }

  private _removeTaskFromDay(task: Task): void {
    const index = this._days.findIndex(day => moment(task.begin).isSame(moment(day.date), 'day'));

    if (index !== -1) {
      const index2 = this._days[index].tasks.findIndex(d => d.id === task.id);

      if (index2 !== -1) {
        this._days[index].tasks.splice(index2, 1);
      }
    }
  }

  private _updateTask(task: Task): void {

    const index = this._waiting.value.findIndex( t => t.id === task.id);

    if (index !== -1) {
      // TODO more complex update of task
      this._waiting.value[index] = task;
      this._waiting.next(this._waiting.value);
    }

    if (task.project) {

      const projects = this._projects.value;
      const index2 = projects.findIndex(p => p.id === task.project.id);
      if (index2 !== -1) {
        const index3 = projects[index].tasks.findIndex(t => t.id === task.id);
        if (index3 !== -1) {
          projects[index].tasks[index3] = task;
        }
      }
    }

  }

  private _updateDayTask(task: Task): void {


    const index = this._days.findIndex(day => moment(task.begin).isSame(moment(day.date), 'day'));

    if (index !== -1) {
      const index2 = this._days[index].tasks.findIndex(d => d.id === task.id);

      if (index2 !== -1) {
        this._days[index].tasks[index2] = task;
      }
    }
  }

  private _updateArchiveTask(task: Task): void {
    const index = this._archive.value.findIndex( t => t.id === task.id);

    if (index !== -1) {
      // TODO more complex update of task
      this._archive.value[index] = task;
      this._archive.next(this._archive.value);
    }


  }

  addProject(project: Project): void {
    this.projectService.create(project).toPromise()
      .then((t) => {
        this._addProject(t);
      })
      .catch(() => {});
  }

  private _addProject(project: Project): void {
    const arr = [...this._projects.value];
    arr.unshift(project);
    this._projects.next([...arr]);
  }

  updateProject(project: Project): void {
    this.projectService.update(project).toPromise()
      .then(() => {
        this._updateProject(project);
      })
      .catch(() => {});
  }

  private _updateProject(project: Project): void {
    const projects = [...this._projects.value];
    const index = projects.findIndex(p => p.id === project.id);
    if (index !== -1) {
      project.tasks = projects[index].tasks;
      projects[index] = project;
      project.tasks.forEach(t => {
        t.project = project;
        this._updateTask(t);
      });


      this._projects.next(projects);
    }
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
    this.taskService.getTasks(from.getTime(), to.getTime()).subscribe((tasks: Task[]) => {
      const days = this._days.filter((day) => moment(day.date).isBetween(momentFrom, momentTo, 'day', '[]'));
      days.forEach((day) => {
        day.tasks = tasks.filter((t) => moment(day.date).isSame(moment(t.begin, 'day')));
        // TODO what to do with deadlines
      });
    });
  }

  private sortDays(list: PlanningDay[]): void {
    list.sort((a, b) => {
      const aMil: number = a.date.getTime();
      const bMil: number  = b.date.getTime();
      return Math.sign(aMil - bMil);
    } );
  }

  private addDays(list: PlanningDay[]): void {
    this._days.push(...list);
    this.sortDays(this._days);
  }
}

