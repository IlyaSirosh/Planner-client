import {Component, forwardRef, Input, OnChanges, OnDestroy, OnInit} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {PlanningMonth} from '../../domain/planning-month';
import {PlanningDay} from '../../domain/planning-day';
import {PlanningService} from '../../planning.service';
import {ActivatedRoute, Router} from '@angular/router';
import {map, switchMap, take, tap} from 'rxjs/internal/operators';
import {ReplaySubject} from 'rxjs';

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

  private currentMonthDate = new ReplaySubject(1);
  private $currentMonthDate = this.currentMonthDate.asObservable();

  constructor(private planningService: PlanningService, private route: ActivatedRoute) {
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

    this.$currentMonthDate
      .pipe(
        tap(console.log),
        switchMap((date: Date) => this.planningService.getMonth(new Date(date)))
      )
      .subscribe((month: PlanningMonth) => this.month = month);

    this.sub = this.route.params.pipe(
      take(1),
      map( params => {
        // TODO get real date 'cause this code does not work
        let date = new Date(Date.now());
        if (params === {}) {
          date = new Date(Date.now());
        } else {
          if (+params.year && +params.month && +params.day) {
            date = new Date(+params.year, (+params.month) - 1,  +params.day);
          } else if (+params.year && +params.month) {
            date = new Date(+params.year, (+params.month) - 1,  1);
          } else {
            date = new Date(Date.now());
          }
        }

        return date;
      }),
    ).subscribe( (date: Date) => {
      this.currentMonthDate.next(date);
    });
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  writeValue(obj: Date): void {
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
    this.currentMonthDate.next(next);
  }

  nextMonth(): void {
    const next = this.planningService.getNextMonthDate(this.month.date);
    this.currentMonthDate.next(next);
  }

  enable(): void {
    this.new = false;
    this.showCalendar = !this.deadline;
  }

  edit(): void {
    this.currentMonthDate.next(this.deadline);
    this.showCalendar = true;
  }

  close(): void {
    this.writeValue(null);
  }
}
