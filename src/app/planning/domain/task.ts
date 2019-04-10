import {Project} from './project';

export class Task {
  id: number;
  title: string;
  project?: Project;
  deadline?: Date;
  begin?: Date;
  end?: Date;
  repeat: TaskRepeat;
  position?: number;
  list: TaskList;
  notes?: string;
  planed?: boolean;
}

export enum TaskList {
  PLANNED = null, WAITING = 0, ARCHIVE = -1
}

export class TaskRepeat {

  days: string[];
  repetition: Repetition;

}

export enum Repetition {
  Daily, Weekly, Monthly
}
