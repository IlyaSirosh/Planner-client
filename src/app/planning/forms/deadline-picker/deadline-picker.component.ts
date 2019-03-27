import { Component, OnInit } from '@angular/core';
import {ControlValueAccessor} from '@angular/forms';

@Component({
  selector: 'app-deadline-picker',
  templateUrl: './deadline-picker.component.html',
  styleUrls: ['./deadline-picker.component.css']
})
export class DeadlinePickerComponent implements OnInit, ControlValueAccessor {

  constructor() { }

  ngOnInit() {
  }

}
