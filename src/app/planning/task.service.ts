import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {Task} from './domain/task';
import {Project} from './domain/project';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor() { }

  getWaitingTasks(): Observable<Task[]> {
    return new Observable<Task[]>((resolver) => resolver.next([]));
  }

  getTasksByProject(project: Project): Observable<Task[]> {
    return new Observable<Task[]>((resolver) => resolver.next([]));
  }




  create(task: Task): Observable<any> {
    return new Observable<any>((resolver) => resolver.next(null) );
  }

  update(task: Task): Observable<any> {
    return new Observable<any>((resolver) => resolver.next(null) );
  }

  delete(task: Task): Observable<any> {
    return new Observable<any>((resolver) => resolver.next(null) );
  }

}
