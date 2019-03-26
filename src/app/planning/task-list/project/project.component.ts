import {Component, Input, OnInit} from '@angular/core';
import {Project} from '../../domain/project';
import {Task} from '../../domain/task';

@Component({
  selector: 'planning-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit {

  @Input() project: Project;
  tasks: Task[];
  constructor() { }

  ngOnInit() {
    this.tasks = Task.TASKS.slice(0, 4);
  }

}
