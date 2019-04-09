import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Project} from './domain/project';
import {map, tap} from 'rxjs/internal/operators';
import {Task} from './domain/task';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  URL;

  constructor(private http: HttpClient) {

    this.URL = `https://ukma-schedule-back.herokuapp.com/api/project`;
  }


  create(project: Project): Observable<any> {
    const body = this.mapToBackFormat(project);
    const hd = new HttpHeaders({'content-type': 'application/json'});
    return this.http.post(this.URL, body, {headers: hd})
      .pipe(map((v: {id: number}) => {
      project.id = v.id;
      return {...project};
    }), tap(data => console.log(data), error => console.error(error)));
  }

  update(project: Project): Observable<any> {
    const body = this.mapToBackFormat(project);
    const hd = new HttpHeaders({'content-type': 'application/json'});
    return this.http.patch(this.URL, body, {headers: hd})
      .pipe(tap(data => console.log(data), error => console.error(error)));
  }

  getProjects(): Observable<any> {
    return new Observable<Task[]>((resolver) => resolver.next([]));
  }

  mapToBackFormat(project: Project): any {
    const res = {...project} as any;

    if (project.deadline) {
      res.deadline = project.deadline.getTime();
    }

    return res;
  }

}
