import {Component, Input, OnInit} from '@angular/core';
import {Repetition, TaskRepeat} from '../../domain/task';

@Component({
  selector: 'app-repetition-label',
  templateUrl: './repetition-label.component.html',
  styleUrls: ['./repetition-label.component.css']
})
export class RepetitionLabelComponent implements OnInit {

  @Input() taskRepeat: TaskRepeat;
  REPETITION = Repetition;

  constructor() { }

  ngOnInit() {
  }

}
