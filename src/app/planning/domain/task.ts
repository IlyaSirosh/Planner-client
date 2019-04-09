import {Project} from './project';

export class Task {
  id: number;
  title: string;
  project: Project;
  deadline: Date;
  isPlaned: boolean;
  begin: Date;
  end: Date;
  repeat: TaskRepeat;
  position: number;
}



export class TaskRepeat {

  days: string[];
  repetition: Repetition;

}

export enum Repetition {
  Daily, Weekly, Monthly
}
