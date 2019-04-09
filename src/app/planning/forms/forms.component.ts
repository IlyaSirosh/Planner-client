import {Component, ElementRef, OnInit, Renderer2, TemplateRef, ViewChild} from '@angular/core';
import {optionStateTrigger} from './forms.animations';
import {FormsService} from './forms.service';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
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
  form: FormGroup;

  addProjectToTask = false;
  showProjectSelectionForm = true;

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

      if (task && task.project) {
        this.addProjectToTask = true;
        this.showProjectSelectionForm = true;
      }
    }
    this.template = this.taskTemplate;
    this.showForm = true;
    this.form = this.taskForm;
  }

  openProjectForm(project: Project): void {
    if (project) {
      this.projectForm.setValue(project);
    }
    this.template = this.projectTemplate;
    this.showForm = true;
    this.form = this.projectForm;
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
    this.addProjectToTask = false;
    this.showProjectSelectionForm = true;
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
      title: [null, Validators.required],
      notes: null,
      repeat: null,
      deadline: null,
      project: null,
      list: null
    });


    this.projectForm = this.formBuilder.group({
      id: null,
      name: [null, Validators.required],
      deadline: null,
      color: null,
      notes: null
    });
  }

  save(): void {
    console.log(this.form.value);

    if (this.form.valid) {
      if (this.callbackFn) {

        this.callbackFn(this.form.value);
      }
      this.closeForm();
    } else {

      this.markTouched(this.form);
    }


  }

  selectProject(): void {
    this.addProjectToTask = true;
    this.showProjectSelectionForm = true;
  }

  createProject(): void {
    this.addProjectToTask = true;
    this.showProjectSelectionForm = false;
  }

  removeTaskProject(): void {
    this.addProjectToTask = false;
  }

  private markTouched(form: FormGroup): void {
    Object.keys(form.controls).forEach(field => {
      const control = form.get(field);
      control.markAsTouched({ onlySelf: true });

      if((control as FormGroup).controls)
        this.markTouched(control as FormGroup);

      if((control as FormArray).controls) {
        Array.from((control as FormArray).controls).forEach((x:FormGroup) => this.markTouched(x));
      }

    });
  }

  get taskName() {
    return this.taskForm.get('title');
  }

  get projectName() {
    return this.projectForm.get('name');
  }
}
