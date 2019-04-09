import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {Task} from './domain/task';
import {Project} from './domain/project';
import {HttpClient} from '@angular/common/http';
import {catchError, map, tap} from 'rxjs/internal/operators';



@Injectable({
  providedIn: 'root'
})
export class TaskService {

  URL;

  constructor(private http: HttpClient) {

    this.URL = `https://ukma-schedule-back.herokuapp.com/api/task`;
  }


  getWaitingTasks(): Observable<Task[]> {
    return new Observable<Task[]>((resolver) => resolver.next([]));
  }

  getTasksByProject(project: Project): Observable<Task[]> {
    return new Observable<Task[]>((resolver) => resolver.next([]));
  }




  create(task: Task): Observable<any> {

    const body = this.mapToBackFormat(task);

    return this.http.post(this.URL, body).pipe( map((v: {id: number}) => {
      task.id = v.id;
      return {...task};
    }), tap(data => console.log(data), error => console.error(error)));

  }

  update(task: Task): Observable<any> {
    return new Observable<any>((resolver) => resolver.next(null) );
  }

  delete(task: Task): Observable<any> {
    return new Observable<any>((resolver) => resolver.next(null) );
  }

  getTasks(from: number, to: number): Observable<any> {
    return new Observable<any>((resolver) => resolver.next([]) );
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
