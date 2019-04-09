import {Component, forwardRef, OnInit} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';


@Component({
  selector: 'app-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ColorPickerComponent),
      multi: true
    }
  ]
})
export class ColorPickerComponent implements OnInit, ControlValueAccessor {

  private _color: string;

  onChange = (color: string) => {};
  onTouch = () => {};

  constructor() { }

  ngOnInit() {
  }

  writeValue(obj: any): void {
    this.color = obj;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  set color(c: string) {
    this._color = c;
    this.onChange(c);
  }

  get color() {
    return this._color;
  }
}
