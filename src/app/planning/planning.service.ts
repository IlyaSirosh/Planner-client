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

  constructor(private taskService: TaskService) { }


  addTask(task: Task): void {
    this.taskService.create(task).toPromise()
      .then((t) => {
        this._addTask(t);
      })
      .catch(() => {});
  }

  private _addTask(task: Task): void {
    this._waiting.next([...this._waiting.value.unshift(task)]);
  }

  updateTask(task: Task): void {

  }
}
