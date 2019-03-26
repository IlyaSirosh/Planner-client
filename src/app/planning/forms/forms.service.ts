import {EventEmitter, Injectable} from '@angular/core';
import {Project} from '../domain/project';
import {Task} from '../domain/task';

@Injectable({
  providedIn: 'root'
})
export class FormsService {

  private _openTaskForm = new EventEmitter<any>();
  public readonly $openTaskForm = this._openTaskForm.asObservable();

  private _openProjectForm = new EventEmitter<any>();
  public readonly $openProjectForm = this._openProjectForm.asObservable();

  constructor() { }


  openTaskForm(task: Task, ev, fn): void {
    this._openTaskForm.emit({value: task, event: ev, callback: fn});
  }

  openProjectForm(project: Project, ev, fn): void {
    this._openProjectForm.emit({value: project, event: ev, callback: fn});
  }

}
