import {Component, ElementRef, HostListener, Input, OnInit} from '@angular/core';
import {Task} from '../../domain/task';
import {taskButtonsStateTrigger} from './day-task.animations';

@Component({
  selector: 'day-task',
  templateUrl: './day-task.component.html',
  styleUrls: ['./day-task.component.css'],
  animations: [taskButtonsStateTrigger]
})
export class DayTaskComponent implements OnInit {
  @Input() task: Task;
  showActionButtons: boolean;
  constructor(public elem: ElementRef) {
    this.showActionButtons = false;
  }

  ngOnInit() {
  }

  @HostListener('mouseover') showButtons(): void {
    this.showActionButtons = true;
  }

  @HostListener('mouseleave') hideButtons(): void {
    this.showActionButtons = false;
  }
}
