import {Component, Input, OnInit} from '@angular/core';
import {Project} from '../../domain/project';
import {Task, TaskList} from '../../domain/task';
import {FormsService} from '../../forms/forms.service';
import {PlanningService} from '../../planning.service';

@Component({
  selector: 'planning-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit {

  @Input() project: Project;
  constructor(private formsService: FormsService, private planningService: PlanningService) { }

  ngOnInit() {

  }

  addTask(event) {

    const task = new Task();
    task.list = TaskList.WAITING;
    task.project = this.project;

    this.formsService.openTaskForm(task, event, (result) => {
      this.planningService.addTask(result, TaskList.WAITING);
    });
  }
}
