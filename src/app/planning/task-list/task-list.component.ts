import {AfterViewInit, Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {Task} from '../domain/task';
import {FormsService} from '../forms/forms.service';
import {PlanningService} from '../planning.service';


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
  constructor(private formsService: FormsService, private planningService: PlanningService) { }

  ngOnInit() {
    this.selectWaitingTab(this.waitingTasksRef);
  }

  ngAfterViewInit() {
  }

  openTaskFrom(e, task = null): void {
    this.formsService.openTaskForm(task, e, (result) => {
      if (task) {
        this.planningService.updateTask(result);
      } else {
        this.planningService.addTask(result);
      }
    });
  }

  openProjectForm(e, project = null): void {
    this.formsService.openProjectForm(project, e, (result) => {
      if (project) {
        this.planningService.updateProject(result);
      } else {
        this.planningService.addProject(result);
      }
    });
  }

  selectWaitingTab(ref: TemplateRef<any>): void {
    this.activeTabRef = ref;

    this.ctx = {list: this.planningService.$waitingList};
  }

  selectProjectsTab(ref: TemplateRef<any>): void {
    this.activeTabRef = ref;
    this.ctx = {list: this.planningService.$projects};
  }

  selectArchiveTab(ref: TemplateRef<any>): void {
    this.activeTabRef = ref;
    this.ctx = {list: this.planningService.$archive};
  }

}
