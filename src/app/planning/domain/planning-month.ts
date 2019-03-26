import {PlanningDay, PlanningDayPreview} from './planning-day';

export class PlanningMonth {
  id: number;
  date: Date;
  days: PlanningDay[];
}

export class PlanningMonthPreview {
  id: number;
  date: Date;
  days: PlanningDayPreview[];
}
