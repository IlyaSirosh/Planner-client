import {Task, TaskPreview} from './task';

export class PlanningDay {
  id: number;
  date: Date;
  tasks: Task[];
}

export class PlanningDayPreview {
  id: number;
  date: Date;
  tasks: TaskPreview[];
  deadlines: TaskPreview[];
}


