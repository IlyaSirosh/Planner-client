import { Injectable } from '@angular/core';
import {Task, TaskList} from './domain/task';
import {BehaviorSubject, Observable} from 'rxjs';
import {PlanningMonth} from './domain/planning-month';
import {TaskService} from './task.service';
import * as Moment from 'moment';
import { extendMoment } from 'moment-range';
const moment = extendMoment(Moment);
import {PlanningDay} from './domain/planning-day';
import {Project} from './domain/project';
import {ProjectService} from './project.service';
import {DayTimeRangeComponent} from './day/day-time-range/day-time-range.component';
import {filter, map, tap} from 'rxjs/internal/operators';


@Injectable({
  providedIn: 'root'
})
export class PlanningService {

  timeRange: DayTimeRangeComponent;

  private waiting = new BehaviorSubject<Task[]>([]);
  public readonly $waitingList = this.waiting.asObservable();

  private projects = new BehaviorSubject<Project[]>([]);
  public readonly $projects = this.projects.asObservable();

  private archive = new BehaviorSubject<Task[]>([]);
  public readonly $archive = this.archive.asObservable();

  private plannedTasks = new BehaviorSubject<Task[]>([]);
  private $plannedTasks = this.plannedTasks.asObservable();

  private loadedDays: Set<Date> = new Set<Date>();

  constructor(private taskService: TaskService, private projectService: ProjectService) {

    this.taskService.getWaitingTasks()
      .subscribe( (tasks: Task[]) => {
      if (tasks) {
        const a: Task[] = [...tasks, ...this.waiting.getValue()] as Task[];
        this.waiting.next(a);
      }
    });

    this.projectService.getProjects().subscribe((projects: Project[]) => {
      if (projects) {
        const a: Project[] = [ ...projects, ...this.projects.getValue()] as Project[];
        this.projects.next(a);
      }
    });

    this.taskService.getArchive().subscribe( (tasks: Task[]) => {
      if (tasks) {
        const a: Task[] = [...tasks, ...this.archive.getValue()] as Task[];
        this.archive.next(a);
      }
    });
  }


  addTask(task: Task, list: TaskList = TaskList.WAITING): void {
    this.taskService.create(task).toPromise()
      .then((t) => {
        if (list === TaskList.WAITING) {
          this._addTaskToWaiting(t);
        } else {
          this._addTaskToDay(t);
        }
      })
      .catch(() => {});
  }

  private _addTaskToWaiting(task: Task): void {
    const arr = [...this.waiting.value];
    arr.unshift(task);
    this.waiting.next(arr);

    // if (task.project) {
    //
    //   const projects = this.projects.value;
    //   const index = projects.findIndex(p => p.id === task.project.id);
    //   if (index < 0) {
    //     projects[index].tasks.unshift(task);
    //     this.projects.next(this.projects.value);
    //   }
    // }
  }
  private _addTaskToDay(task: Task): void {
    const arr = [...this.plannedTasks.value];
    arr.push({...task});
    this.plannedTasks.next(arr);
  }

  private _addTaskToArchive(task: Task): void {
    const arr = [...this.archive.value];
    arr.unshift(task);
    this.archive.next(arr);
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
            this._addTaskToDay(task);
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
    const index = this.waiting.value.findIndex( t => t.id === task.id);

    if (index !== -1) {
      this.waiting.value.splice(index, 1);
      this.waiting.next(this.waiting.value);
    }

    // if (task.project) {
    //
    //   const projects = this.projects.value;
    //   const index2 = projects.findIndex(p => p.id === task.project.id);
    //   if (index2 !== -1) {
    //     const index3 = projects[index].tasks.findIndex(t => t.id === task.id);
    //     if (index3 !== -1) {
    //       projects[index].tasks.splice(index3, 1);
    //     }
    //   }
    // }
  }

  private _removeTaskFromArchive(task: Task): void {
    const index = this.archive.value.findIndex( t => t.id === task.id);

    if (index !== -1) {
      const arr = [...this.archive.value];
      arr.splice(index, 1);
      this.archive.next(arr);
    }
  }

  private _removeTaskFromDay(task: Task): void {
    const index = this.plannedTasks.value.findIndex( t => t.id === task.id);

    if (index !== -1) {
      const arr = [...this.plannedTasks.value];
      arr.splice(index, 1)
      this.plannedTasks.next(arr);
    }
  }

  private _updateTask(task: Task): void {

    const index = this.waiting.value.findIndex( t => t.id === task.id);

    if (index !== -1) {
      // TODO more complex update of task
      const arr = [...this.waiting.value];
      arr[index] = {...task};
      this.waiting.next(arr);
    }

    // if (task.project) {
    //
    //   const projects = this.projects.value;
    //   const index2 = projects.findIndex(p => p.id === task.project.id);
    //   if (index2 !== -1) {
    //     const index3 = projects[index].tasks.findIndex(t => t.id === task.id);
    //     if (index3 !== -1) {
    //       projects[index].tasks[index3] = task;
    //     }
    //   }
    // }

  }

  private _updateDayTask(task: Task): void {

    const index = this.plannedTasks.value.findIndex( t => t.id === task.id);

    if (index !== -1) {
      const arr = [...this.plannedTasks.value];
      arr[index] = {...task};
      this.plannedTasks.next(arr);
    }
  }

  private _updateArchiveTask(task: Task): void {
    const index = this.archive.value.findIndex( t => t.id === task.id);

    if (index !== -1) {
      // TODO more complex update of task
      const arr = [...this.archive.value];
      arr[index] = {...task};
      this.archive.next(arr);
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
    const arr = [...this.projects.value];
    arr.unshift(project);
    this.projects.next(arr);
  }

  updateProject(project: Project): void {
    this.projectService.update(project).toPromise()
      .then(() => {
        this._updateProject(project);
      })
      .catch(() => {});
  }

  private _updateProject(project: Project): void {
    const projects = [...this.projects.value];
    const index = projects.findIndex(p => p.id === project.id);
    if (index !== -1) {
      project.tasks = projects[index].tasks;
      projects[index] = project;
      project.tasks.forEach(t => {
        t.project = project;
        this._updateTask(t);
      });


      this.projects.next(projects);
    }
  }

  getCurrentMonthDate(): Date {
    return moment(new Date(Date.now())).startOf('month').toDate();
  }

  getCurrentDate(): Date {
    return new Date(Date.now());
  }

  getMonth(date: Date): Observable<PlanningMonth> {
    const month = new PlanningMonth();
    month.date = moment(date).startOf('month').toDate();
    const {from, to} = PlanningService.findMonth(date);
    month.days = PlanningService.generateDays(from, to);
    this.askForTasks(from, to);
    return this.$plannedTasks.pipe(
      map((tasks: Task[] ) => tasks.filter( t => moment(t).isBetween(from, to, 'day', '[]'))),
      map((tasks: Task[]) => {
             month.days = this.tasksMapToDays(tasks, month.days);
             return month;
           })
    );
  }

  private tasksMapToDays(tasks: Task[], days: PlanningDay[]): PlanningDay[] {
    const result = [...days];

    result.forEach((day: PlanningDay) => {
      day.tasks = tasks.filter((task: Task) => moment(task.begin).isSame(moment(day.date), 'day') );
    });

    return result;
  }

  getNextMonthDate(date: Date): Date {
    return moment(date).add(1, 'months').toDate();
  }

  getPrevMonthDate(date: Date): Date {
    return moment(date).subtract(1, 'months').toDate();
  }


  getDay(date: Date): Observable<PlanningDay> {
    return this.$plannedTasks.pipe(
      map( (tasks: Task[]) => {
              const day = new PlanningDay();
              day.date = date;
              day.tasks = tasks.filter(task => moment(task.begin).isSame(moment(day.date), 'day'));
              return day;
          })
    );
  }

  getCurrentDay(): Observable<PlanningDay> {
    const date =  new Date(Date.now());
    return this.getDay(date);
  }

  getNextDayDate(date: Date): Date {
    return moment(date).add(1, 'days').toDate();
  }

  getPrevDayDate(date: Date): Date {
    return moment(date).subtract(1, 'days').toDate();
  }


  private static findMonth(date: Date): {from: Date, to: Date} {
    let begin = moment(date).startOf('month');
    let end = moment(date).endOf('month');

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


  private static generateDays(from: Date, to: Date): PlanningDay[] {

    return Array.from(moment.range(from, to).by('days')).map(date => {
      const day = new PlanningDay();
      day.date = date.startOf('day').toDate();
      day.tasks = [];
      day.deadlines = [];
      return day;
    });

  }


  private askForTasks(from: Date, to: Date): void {
    this.taskService.getTasks(from.getTime(), to.getTime())
      .pipe(tap(tasks => {
        console.log(`load tasks from:${from} to:${to} loaded:${tasks.length}`);
        console.log(tasks);
      }))
      .subscribe((tasks: Task[]) => {
      Array.from(moment.range(from, to).by('days')).map(date => date.startOf('day').toDate())
        .forEach(x => {
          if (!this.loadedDays.has(x)) {
            this.loadedDays.add(x);
          }
        });
      this.addTasks(tasks);
    });


    // TODO ask here for deadlines and map them
  }


  private addTasks(tasks: Task[]): void {
    const arr: Task[] = [...tasks, ...this.plannedTasks.getValue()];
    const result = [];
    const m = new Map();
    for (const x of arr) {
      if (!m.has(x.id)) {
        m.set(x.id, true);
        result.push(x);
      }
    }
    this.plannedTasks.next(result);
  }

}

