import { Component, OnInit } from '@angular/core';
import {ControlValueAccessor} from '@angular/forms';
import {ProjectPreview} from '../../domain/project';

@Component({
  selector: 'app-project-picker',
  templateUrl: './project-picker.component.html',
  styleUrls: ['./project-picker.component.css']
})
export class ProjectPickerComponent implements OnInit, ControlValueAccessor  {

  project: ProjectPreview;

  projects: ProjectPreview[];

  constructor() { }

  ngOnInit() {
  }

  writeValue(obj: any): void {
    this.project = obj;
  }

  registerOnChange(fn: any): void {
  }

  registerOnTouched(fn: any): void {
  }

}