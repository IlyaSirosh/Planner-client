import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {Task} from './domain/task';
import {Project} from './domain/project';
import {HttpClient, HttpParams} from '@angular/common/http';
import {catchError, map, tap} from 'rxjs/internal/operators';



@Injectable({
  providedIn: 'root'
})
export class TaskService {

  URL;

  constructor(private http: HttpClient) {

    this.URL = `https://ukma-schedule-back.herokuapp.com/api`;
  }

  getArchive(): Observable<any> {
    return this.http.get(`${this.URL}/archiveTasks`)
      .pipe( tap(data => console.log('archive', data), error => console.error(error)),
        map((tasks: Task[]) => tasks.map(t => this.mapFromBackFormat(t)) ));
  }

  getWaitingTasks(): Observable<any> {
    return this.http.get(`${this.URL}/pendingTasks`)
      .pipe( tap(data => console.log('waiting list', data), error => console.error(error)),
      map((tasks: Task[]) => tasks.map(t => this.mapFromBackFormat(t)) ));
  }


  create(task: Task): Observable<any> {

    const body = this.mapToBackFormat(task);

    return this.http.post(`${this.URL}/task`, body).pipe( map((v: {id: number}) => {
      task.id = v.id;
      return {...task};
    }), tap(data => console.log('create', task), error => console.error(error)));

  }

  update(task: Task): Observable<any> {
    const body = this.mapToBackFormat(task);
    return this.http.patch(`${this.URL}/task/${task.id}`, body).pipe( tap(data => console.log('update', task), error => console.error(error)));
  }

  delete(task: Task): Observable<any> {
    return new Observable<any>((resolver) => resolver.next(null) );
  }

  getTasks(from: number, to: number): Observable<any> {
    const p = new HttpParams().set('from', `${from}`).append('to', `${to}`);
    return this.http.get(`${this.URL}/task`, {params: p})
      .pipe( tap(data => console.log('all tasks', data), error => console.error(error)),
        map((tasks: Task[]) => tasks.map(t => this.mapFromBackFormat(t)) ));
  }


  mapToBackFormat(task: Task): any {
    const res = {...task} as any;

    if (task.deadline) {
      res.deadline = new Date(task.deadline).getTime();
    }

    if (task.begin) {
      res.begin = new Date(task.begin).getTime();
    }

    if (task.end) {
      res.end = new Date(task.end).getTime();
    }

    if (task.project) {
      res.project = task.project.id;
    }

    return res;
  }

  mapFromBackFormat(task: any): Task {
    const res = {...task} as any;

    if (task.deadline) {
      res.deadline = new Date(task.deadline);
    }

    if (task.begin) {
      res.begin = new Date(task.begin);
    }

    if (task.end) {
      res.end = new Date(task.end);
    }

    return task;
  }

  handleError(e): void {
    console.error(e);
  }
}
