import {Task} from './task';

export class Project {
  id: number;
  name: string;
  color: string;
  deadline: Date;
  tasks: Task[];

  constructor() {
    this.tasks = [];
  }
}

