import {Component, ElementRef, HostListener, Input, OnInit} from '@angular/core';
import {Task} from '../domain/task';
import {notesStateTrigger, taskButtonsStateTrigger} from './day-task.animations';

@Component({
  selector: 'day-task',
  templateUrl: './day-task.component.html',
  styleUrls: ['./day-task.component.css'],
  animations: [taskButtonsStateTrigger, notesStateTrigger]
})
export class DayTaskComponent implements OnInit {
  @Input() task: Task;
  @Input() isPlaned = true;
  @Input() showNotes = true;
  showNotesTrigger = true;
  showActionButtons: boolean;
  constructor(public elem: ElementRef) {
    this.showActionButtons = false;
  }

  ngOnInit() {
    if (!this.showNotes){
      this.showNotesTrigger = false;
    }
  }

  @HostListener('mouseover') showButtons(): void {
    this.showActionButtons = true;
  }

  @HostListener('mouseleave') hideButtons(): void {
    this.showActionButtons = false;
  }

  toggleNotes(): void {

    if (!this.showNotes) {
      this.showNotesTrigger = !this.showNotesTrigger;
    }
  }

}
