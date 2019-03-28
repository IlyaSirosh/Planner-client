import {AfterViewInit, Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {Task} from '../domain/task';
import {FormsService} from '../forms/forms.service';


@Component({
  selector: 'planning-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit, AfterViewInit {

  @ViewChild('waitingRef') waitingTasksRef: TemplateRef<any>;
  @ViewChild('projectsRef') planingProjectsRef: TemplateRef<any>;

  activeTabRef: TemplateRef<any>;
  ctx;
  constructor(private formsService: FormsService) { }

  ngOnInit() {
    this.selectWaitingTab(this.waitingTasksRef);
  }

  ngAfterViewInit() {
  }

  openTaskFrom(e, task = null): void {
    this.formsService.openTaskForm(task, e, null);
  }

  openProjectForm(e, project = null): void {
    this.formsService.openProjectForm(project, e, null);
  }

  selectWaitingTab(ref: TemplateRef<any>): void {
    this.activeTabRef = ref;
    const c = Task.TASKS;
    this.ctx = {list: c};
    console.log(this.ctx);
  }

  selectProjectsTab(ref: TemplateRef<any>): void {
    this.activeTabRef = ref;

  }

  selectArchiveTab(ref: TemplateRef<any>): void {
    this.activeTabRef = ref;

  }

}
