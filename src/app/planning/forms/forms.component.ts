import {Component, ElementRef, OnInit, Renderer2, TemplateRef, ViewChild} from '@angular/core';
import {optionStateTrigger} from './forms.animations';
import {FormsService} from './forms.service';

@Component({
  selector: 'app-forms',
  templateUrl: './forms.component.html',
  styleUrls: ['./forms.component.css'],
  animations: [optionStateTrigger]
})
export class FormsComponent implements OnInit {

  @ViewChild('taskFormTemplate') taskTemplate: TemplateRef;
  @ViewChild('projectFormTemplate') projectTemplate: TemplateRef;
  @ViewChild('formRef') formTemplate: ElementRef;
  @ViewChild('container') containerRef: ElementRef;
  template: TemplateRef;
  templateContext;

  showForm: boolean;

  showTaskOptions = false;
  taskOptionsLabel = 'more';
  showProjectOptions = false;
  projectOptionsLabel = 'more';

  constructor(private formService: FormsService, private renderer: Renderer2) { }

  ngOnInit() {

    this.formService.$openTaskForm.subscribe( target => {
      this.openTaskForm(target.value);
      this.setFormPosition(target.event);
      // TODO add callback function usage
    });

    this.formService.$openProjectForm.subscribe( target => {
      this.openProjectForm(target.value);
      this.setFormPosition(target.event);
      // TODO add callback function usage
    });
  }

  openTaskForm(task): void {
    this.template = this.taskTemplate;
    this.showForm = true;
  }

  openProjectForm(project): void {
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
  }

  setFormPosition(event): void {

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

}
