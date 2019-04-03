import { Component, OnInit } from '@angular/core';
import {ControlValueAccessor} from '@angular/forms';

@Component({
  selector: 'app-deadline-picker',
  templateUrl: './deadline-picker.component.html',
  styleUrls: ['./deadline-picker.component.css']
})
export class DeadlinePickerComponent implements OnInit, ControlValueAccessor {

  constructor() { }

  onChangedFn;
  onTouchedFn;

  deadline: Date;

  ngOnInit() {
  }

  writeValue(obj: any): void {
    this.deadline = obj;
  }
  registerOnChange(fn: any): void {
    this.onChangedFn = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouchedFn = fn;
  }
  setDisabledState(isDisabled: boolean): void {}

  onDaySelected(day): void {

  }


}
