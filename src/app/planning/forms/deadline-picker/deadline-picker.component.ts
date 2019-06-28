import {Component, forwardRef, Input, OnChanges, OnDestroy, OnInit} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {PlanningMonth} from '../../domain/planning-month';
import {PlanningDay} from '../../domain/planning-day';
import {PlanningService} from '../../planning.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-deadline-picker',
  templateUrl: './deadline-picker.component.html',
  styleUrls: ['./deadline-picker.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DeadlinePickerComponent),
      multi: true
    }
  ]
})
export class DeadlinePickerComponent implements OnInit, ControlValueAccessor, OnDestroy {

  constructor(private planningService: PlanningService, private route: ActivatedRoute) {
    this.month = this.planningService.getCurrentMonth();
  }


  month: PlanningMonth;
  disabled;
  new = true;
  deadline: Date;
  showCalendar = false;
  sub;
  onChangedFn = (deadline: Date) => {};
  onTouchedFn = () => {};

  ngOnInit() {
    let currentDay;

    this.sub = this.route.params.subscribe( params => {
      // TODO change for real access to params
      if (params === {}) {
        currentDay = new Date(Date.now());
      } else {
        if (+params.year && +params.month && +params.day) {
          currentDay = new Date(+params.year, (+params.month) - 1,  +params.day);
        } else if (+params.year && +params.month) {
          currentDay = new Date(+params.year, (+params.month) - 1,  1);
        } else {
          currentDay = new Date(Date.now());
        }
      }

      this.month = this.planningService.getMonth(currentDay);
    });
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  writeValue(obj: any): void {
    this.deadline = obj;
    if (obj) {
      this.new = false;
    } else {
      this.new = true;
    }
    this.onChangedFn(this.deadline);
  }
  registerOnChange(fn: any): void {
    this.onChangedFn = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouchedFn = fn;
  }
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;

  }

  onDaySelected(day): void {
    this.showCalendar = false;
    this.writeValue(day);
  }

  prevMonth(): void {
    const next = this.planningService.getPrevMonthDate(this.month.date);
    this.month = this.planningService.getMonth(next);
  }

  nextMonth(): void {
    const next = this.planningService.getNextMonthDate(this.month.date);
    this.month = this.planningService.getMonth(next);
  }

  enable(): void {
    this.new = false;
    this.showCalendar = !this.deadline;
  }

  edit(): void {
    this.month = this.planningService.getMonth(this.deadline);
    this.showCalendar = true;
  }

  close(): void {
    this.writeValue(null);
  }
}
