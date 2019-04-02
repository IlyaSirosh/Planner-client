import {PlanningDay, PlanningDayPreview} from './planning-day';
let id = 0;
export class PlanningMonth {
  id: number;
  date: Date;
  days: PlanningDay[];

  constructor() {
    this.date = null;
    this.days = [];
  }

  static get MONTH(): PlanningMonth {
    const month = new PlanningMonth();

    month.id = id++;
    month.date = new Date(Date.now());
    month.date.setDate(month.date.getDate() - 1);
    const d = new Date(Date.now());
    month.days = Array.apply(null, Array(42)).map((_, i) => {
      const day = new PlanningDay();
      day.date = this.nextDay(d);
      if (i % 5 === 0) {
        day.tasks = [null, null, null];
      }
      return day;
    });

    return month;
  }

  private static nextDay(curr: Date): Date {
    const res = new Date(curr);
    curr.setDate(curr.getDate() + 1);
    return res;
  }
}

export class PlanningMonthPreview {
  id: number;
  date: Date;
  days: PlanningDayPreview[];

  constructor() {
    this.date = null;
    this.days = [];
  }

  static get MONTH(): PlanningMonthPreview {
    const month = new PlanningMonthPreview();

    month.id = id++;
    month.date = new Date(Date.now());
    month.date.setDate(month.date.getDate() - 1);
    const d = new Date(Date.now());
    month.days = Array.apply(null, Array(42)).map((_, i) => {
      const day = new PlanningDayPreview();
      day.date = this.nextDay(d);
      if (i % 5 === 0) {
        day.tasks = [null, null, null];
      }
      return day;
    });

    return month;
  }

  private static nextDay(curr: Date): Date {
    const res = new Date(curr);
    curr.setDate(curr.getDate() + 1);
    return res;
  }
}
