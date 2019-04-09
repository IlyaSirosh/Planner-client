import {Component, EventEmitter, forwardRef, OnDestroy, OnInit, Output} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {Project} from '../../domain/project';
import {PlanningService} from '../../planning.service';
import {Observable} from 'rxjs';


@Component({
  selector: 'app-project-picker',
  templateUrl: './project-picker.component.html',
  styleUrls: ['./project-picker.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ProjectPickerComponent),
      multi: true
    }
  ]
})
export class ProjectPickerComponent implements OnInit, ControlValueAccessor, OnDestroy  {

  @Output() close = new EventEmitter<any>();

  currentProject: Project;

  $projects: Observable<Project[]>;

  showList: boolean;

  onChange = (v) => {};
  onTouch = () => {};


  constructor(private planningService: PlanningService) {
    this.$projects = this.planningService.$projects;
  }

  ngOnInit() {
  }

  ngOnDestroy() {

  }

  writeValue(obj: any): void {
    this.currentProject = obj;

    this.showList = !this.currentProject;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  select(project: Project): void {
    this.showList = false;
    this.writeValue(project);
    this.onChange(project);
  }

  edit(): void {
    this.showList = true;
  }

  onClose(): void {
    this.close.emit(null);
  }
}
