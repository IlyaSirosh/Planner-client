import {Component, ElementRef, OnInit, Renderer2, TemplateRef, ViewChild} from '@angular/core';
import {optionStateTrigger} from './forms.animations';
import {FormsService} from './forms.service';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {Project} from '../domain/project';
import {Task} from '../domain/task';

@Component({
  selector: 'app-forms',
  templateUrl: './forms.component.html',
  styleUrls: ['./forms.component.css'],
  animations: [optionStateTrigger]
})
export class FormsComponent implements OnInit {

  @ViewChild('taskFormTemplate') taskTemplate: TemplateRef<any>;
  @ViewChild('projectFormTemplate') projectTemplate: TemplateRef<any>;
  @ViewChild('formRef') formTemplate: ElementRef;
  @ViewChild('container') containerRef: ElementRef;
  template: TemplateRef<any>;
  templateContext;

  showForm: boolean;
  showSaveButton = true;

  showTaskOptions = false;
  taskOptionsLabel = 'more';
  showProjectOptions = false;
  projectOptionsLabel = 'more';

  taskForm: FormGroup;
  projectForm: FormGroup;

  callbackFn;

  constructor(private formService: FormsService, private renderer: Renderer2, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.createForms();

    this.formService.$openTaskForm.subscribe( target => {
      this.openTaskForm(target.value);
      this.setFormPosition(target.event);
      this.callbackFn = target.callback;
    });

    this.formService.$openProjectForm.subscribe( target => {
      this.openProjectForm(target.value);
      this.setFormPosition(target.event);
      this.callbackFn = target.callback;
    });

  }

  openTaskForm(task: Task): void {
    if (task) {
      this.taskForm.setValue(task);
    }
    this.template = this.taskTemplate;
    this.showForm = true;
  }

  openProjectForm(project: Project): void {
    if (project) {
      this.projectForm.setValue(project);
    }
    this.template = this.projectTemplate;
    this.showForm = true;
  }

  toggleTaskOptions(): void {
    this.showTaskOptions = !this.showTaskOptions;

    this.taskOptionsLabel = this.showTaskOptions ? 'less' : 'more';
  }

  toggleProjectOptions(): void {
    this.showProjectOptions = !this.showProjectOptions;

    this.projectOptionsLabel = this.showProjectOptions ? 'less' : 'more';
  }

  closeForm(): void {
    this.showForm = false;
    this.taskForm.reset();
    this.projectForm.reset();
    this.showProjectOptions = false;
    this.showTaskOptions = false;
  }

  private setFormPosition(event): void {

    const rect = this.formTemplate.nativeElement.getBoundingClientRect();
    const containerRect = this.containerRef.nativeElement.getBoundingClientRect();
    let top = event.clientY - 100;
    let left = event.clientX - 400;

    if (left < containerRect.width / 2) {
      left = (containerRect.width  - rect.width) / 2;
    }
    if (top > containerRect.height / 2) {
      top = (containerRect.height - rect.height) / 2;
    }
    if (top < 0) {
      top = 20;
    }

    this.renderer.setStyle(this.formTemplate.nativeElement, 'top', `${top}px`);
    this.renderer.setStyle(this.formTemplate.nativeElement, 'left', `${left}px`);

  }


  private createForms(): void {
    this.taskForm = this.formBuilder.group({
      id: null,
      title: null,
      notes: null,
      repeat: null,
      deadline: null,
      project: null
    });


    this.projectForm = this.formBuilder.group({
      id: null,
      name: null,
      deadline: null,
      color: null
    });
  }

  save(): void {
    console.log(this.taskForm.value);

    if (this.callbackFn) {
      this.callbackFn(this.taskForm.value);
    }
    this.closeForm();

  }



}
