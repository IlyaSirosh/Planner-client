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

  getArchive(): Observable<Task[]> {
    return this.http.get(`${this.URL}/archiveTasks`);
  }

  getWaitingTasks(): Observable<Task[]> {
    return this.http.get(`${this.URL}/pendingTasks`);
  }


  create(task: Task): Observable<any> {

    const body = this.mapToBackFormat(task);

    return this.http.post(`${this.URL}/task`, body).pipe( map((v: {id: number}) => {
      task.id = v.id;
      return {...task};
    }), tap(data => console.log(data), error => console.error(error)));

  }

  update(task: Task): Observable<any> {
    const body = this.mapToBackFormat(task);
    return this.http.patch(`${this.URL}/task`, body).pipe( tap(data => console.log(data), error => console.error(error)));
  }

  delete(task: Task): Observable<any> {
    return new Observable<any>((resolver) => resolver.next(null) );
  }

  getTasks(from: number, to: number): Observable<any> {
    const p = new HttpParams().set('from', `${from}`).append('to', `${to}`);
    return this.http.get(`${this.URL}/task`, {params: p}).pipe( tap(data => console.log(data), error => console.error(error)));;
  }


  mapToBackFormat(task: Task): any {
    const res = {...task} as any;

    if (task.deadline) {
      res.deadline = task.deadline.getMilliseconds();
    }

    if (task.begin) {
      res.begin = task.begin.getMilliseconds();
    }

    if (task.end) {
      res.end = task.end.getMilliseconds();
    }

    return res;
  }

  mapFromBackFormat(task: any): Task {

    return null;
  }

  handleError(e): void {
    console.error(e);
  }
}
