import {AfterViewInit, Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {Task, TaskList} from '../domain/task';
import {FormsService} from '../forms/forms.service';
import {PlanningService} from '../planning.service';
import {Observable} from 'rxjs';
import {Project} from '../domain/project';


@Component({
  selector: 'planning-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit, AfterViewInit {

  @ViewChild('waitingRef') waitingTasksRef: TemplateRef<any>;
  @ViewChild('projectsRef') planingProjectsRef: TemplateRef<any>;

  activeTabRef: TemplateRef<any>;

  $waitingList: Observable<Task[]>;
  $projects: Observable<Project[]>;
  $archive: Observable<Task[]>;

  ctx;

  TaskList = TaskList;

  constructor(private formsService: FormsService, private planningService: PlanningService) { }

  ngOnInit() {
    this.$waitingList = this.planningService.$waitingList;
    this.$projects = this.planningService.$projects;
    this.$archive = this.planningService.$archive;

    this.selectWaitingTab(this.waitingTasksRef);
  }

  ngAfterViewInit() {
  }

  openTaskFrom(e, task = null): void {
    this.formsService.openTaskForm(task, e, (result) => {
      if (task) {
        this.planningService.updateTask(result,  TaskList.WAITING);
      } else {
        this.planningService.addTask(result,  TaskList.WAITING);
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

  moveToArchive(task): void {
    this.planningService.moveTask(task, TaskList.WAITING, TaskList.ARCHIVE);
  }

  editTask(task: Task, list: TaskList, event): void {
    this.formsService.openTaskForm(task, event, (result) => {
        this.planningService.updateTask(result,  list);
    });
  }
}
