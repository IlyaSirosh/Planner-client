import {AfterViewChecked, AfterViewInit, Component, ElementRef, Input, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {Task} from '../../domain/task';
import {BehaviorSubject, Observable} from 'rxjs';

@Component({
  selector: 'day-time-range',
  templateUrl: './day-time-range.component.html',
  styleUrls: ['./day-time-range.component.css']
})
export class DayTimeRangeComponent implements OnInit, AfterViewInit{

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


  private _taskNodes = new BehaviorSubject<TaskNode[]>([]);
  public readonly $taskNodes = this._taskNodes.asObservable();
  private _setRefs = new BehaviorSubject<boolean>(false);
  public readonly $setRefs = this._setRefs.asObservable();

  constructor(private elem: ElementRef) { }

  ngOnInit() {
    this.numberOfHours = 18;
    this.startsFrom = 6;
    this.width = this.elem.nativeElement.offsetWidth;
    this.offsetToTimeline = this.width / 2;
    this.strokeWidth = 0.1;
    this.taskHalfWidth = 25;

    this.hours = Array.apply(null, {length: this.numberOfHours}).map((_, i) => (this.startsFrom + i) % 24);
    this.height = this.elem.nativeElement.offsetHeight;

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

    this.initTasks();
  }

  ngAfterViewInit() {

    console.log(this.taskRefs);
    this.setRefsOfTask();
  }



  initTasks(): void {
    this._taskNodes.next( this.tasks
      .filter(task => task.begin)
      .map((task, i) => {
        const node = new TaskNode();
        node.task = {...task};
        node.color = this.colors[i];
        node.duration = this.duration(task);
        node.height = this.heightOfTask(task);
        node.top = this.offsetTaskStart(task);
        node.left = this.offsetToTimeline - this.taskHalfWidth;
        return node;
    }));
  }

  addTask(task: Task): void {

    this.setRefsOfTask();
  }

  updateTask(task: Task): void {

  }

  removeTask(task: Task): void {

    this.setRefsOfTask();
  }

  public setRefsOfTask(): void {
    const refArr = this.taskRefs.toArray();
    this._taskNodes.value.forEach((node, i) => {
      node.ref = refArr[i];
    });

    this._setRefs.next(true);
  }

  private heightOfTask(task: Task): number {
    if (!task.end) {
      return this.offsetPerHour / 3;
    }
    const durationHours = (task.end.getTime() - task.begin.getTime()) / (1000 * 60 * 60) ;
    const height = this.offsetPerHour * durationHours;
    return height > 0 ? height : this.offsetPerHour / 6;
  }

  private offsetTaskStart(task: Task): number {
    const offset = (1 + (task.begin.getHours() - this.startsFrom ) + (task.begin.getMinutes() / 60)) * this.offsetPerHour;
    return offset;
  }

  private duration(task: Task): string {
    if (!task.end || !task.begin) {
      return '';
    }
    const durationMinutes = (task.end.getTime() - task.begin.getTime()) / 60000;
    const hours = Math.floor(durationMinutes / 60);
    const minutes = durationMinutes % 60;
    let s = hours > 0 ? `${hours}h ` : '';
    s += minutes > 0 ? `${minutes}m` : '';
    return s;
  }

}

export class TaskNode {
  task: Task;
  left: number;
  top: number;
  height: number;
  color: string;
  duration: string;
  ref: ElementRef;
}
