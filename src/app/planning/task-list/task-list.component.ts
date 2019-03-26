import {AfterViewInit, Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {Task} from '../domain/task';


@Component({
  selector: 'planning-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit, AfterViewInit {

  @ViewChild('waitingRef') waitingTasksRef: TemplateRef;
  @ViewChild('projectsRef') planingProjectsRef: TemplateRef;

  activeTabRef: TemplateRef;
  ctx;
  constructor() { }

  ngOnInit() {
    this.selectWaitingTab(this.planingProjectsRef);
  }

  ngAfterViewInit() {
  }

  addTask(list): void {

  }

  selectWaitingTab(ref: TemplateRef): void {
    this.activeTabRef = ref;
    const c = Task.TASKS;
    this.ctx = {list: c};
    console.log(this.ctx);
  }

  selectProjectsTab(ref: TemplateRef): void {
    this.activeTabRef = ref;

  }

  selectArchiveTab(ref: TemplateRef): void {
    this.activeTabRef = ref;

  }

}
