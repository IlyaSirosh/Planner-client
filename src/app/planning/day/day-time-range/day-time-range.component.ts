import {AfterViewInit, Component, ElementRef, Input, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {Task} from '../../domain/task';

@Component({
  selector: 'day-time-range',
  templateUrl: './day-time-range.component.html',
  styleUrls: ['./day-time-range.component.css']
})
export class DayTimeRangeComponent implements OnInit, AfterViewInit {

  @Input() numberOfHours: number;
  @Input() startsFrom: number;
  @Input() tasks: Task[];
  colors: string[];
  @ViewChild('svg') svg: ElementRef;
  @ViewChildren('tasks') taskRefs: QueryList<ElementRef>;
  height: number;
  width: number;
  offsetPerHour: number;
  hours: number[];
  offsetToTimeline: number;
  strokeWidth: number;
  taskHalfWidth: number;

  constructor(private elem: ElementRef) { }

  ngOnInit() {
    this.numberOfHours = 18;
    this.startsFrom = 6;
    this.offsetToTimeline = 90;
    this.strokeWidth = 0.1;
    this.taskHalfWidth = 25;

    this.hours = Array.apply(null, {length: this.numberOfHours}).map((_, i) => (this.startsFrom + i) % 24);
    console.log(this.hours);
    this.height = this.elem.nativeElement.offsetHeight;
    this.width = this.elem.nativeElement.offsetWidth;
    this.offsetPerHour = (this.height - this.numberOfHours * this.strokeWidth) / (this.numberOfHours + 1) + this.strokeWidth;
    console.log(`${this.width} ${this.height}`);
    this.colors = [
      '#375E97',
      '#FB6542',
      '#FFBB00',
      '#3F681C',
      '#626D71',
      '#CDCDC0',
      '#DDBC95',
      '#B38867',
      '#A1BE95',
      '#E2DFA2',
      '#92AAC7',
      '#ED5752',
      '#EAE2D6',
      '#D5C3AA',
      '#867666',
      '#E1B80D',
    ];
  }

  ngAfterViewInit() {
    console.log(this.taskRefs);
  }

  heightOfTask(task: Task): number {
    if (!task.end) {
      return this.offsetPerHour / 3;
    }
    const durationHours = (task.end.getTime() - task.begin.getTime()) / (1000 * 60 * 60) ;
    const height = this.offsetPerHour * durationHours;
    return height > 0 ? height : this.offsetPerHour / 6;
  }

  offsetTaskStart(task: Task): number {
    const offset = (1 + (task.begin.getHours() - this.startsFrom ) + (task.begin.getMinutes() / 60)) * this.offsetPerHour;
    return offset;
  }

  duration(task: Task): string {
    const durationMinutes = (task.end.getTime() - task.begin.getTime()) / 60000;
    const hours = Math.floor(durationMinutes / 60);
    const minutes = durationMinutes % 60;
    let s = hours > 0 ? `${hours}h ` : '';
    s += minutes > 0 ? `${minutes}m` : '';
    return s;
  }

  trackByTaskId(t: Task): number {
    return t.id;
  }
}

class TaskNode {
  task: Task;
  left: number;
  top: number;
  height: number;
  color: string;
  duration: string;

}
