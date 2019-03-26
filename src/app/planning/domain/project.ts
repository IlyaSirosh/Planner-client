import {Task} from './task';

export class Project {
  id: number;
  name: string;
  deadline: Date;
  color: string;
  tasks: Task[];
}

export class ProjectPreview {
  id: number;
  name: string;
  color: string;
  deadline: Date;
}
