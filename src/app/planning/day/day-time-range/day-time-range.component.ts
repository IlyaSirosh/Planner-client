import {
  AfterViewChecked, AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Input, OnChanges, OnInit, Output, QueryList,
  SimpleChanges,
  ViewChild,
  ViewChildren
} from '@angular/core';
import {Task} from '../../domain/task';
import {BehaviorSubject, Observable, of, ReplaySubject} from 'rxjs';
import {map, switchMap, tap, withLatestFrom} from 'rxjs/internal/operators';



@Component({
  selector: 'day-time-range',
  templateUrl: './day-time-range.component.html',
  styleUrls: ['./day-time-range.component.css']
})
export class DayTimeRangeComponent implements OnInit, AfterViewInit, OnChanges {

  @Input() numberOfHours: number;
  @Input() startsFrom: number;
  @Input() tasks: Task[];
  @Output() rendered = new EventEmitter();
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
  public readonly $taskNodes = this._taskNodes.asObservable().pipe(
    tap(v => {
      console.log(v);
      console.log(this.taskRefs);
      this.render();
    })
  );

  private refs = new ReplaySubject(1);
  public readonly $refs = this.refs.asObservable();

  constructor(private elem: ElementRef) { }

  ngOnInit() {

    this.numberOfHours = 18;
    this.startsFrom = 6;
    this.strokeWidth = 0.1;
    this.taskHalfWidth = 25;
    this.hours = Array.apply(null, {length: this.numberOfHours}).map((_, i) => (this.startsFrom + i) % 24);

    this.alignTimeLine();

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

  ngOnChanges(changes: SimpleChanges) {
    if (!changes['tasks'].isFirstChange()) {
      this.initTasks();
    }
  }

  ngAfterViewInit() {
    this.taskRefs.changes.subscribe( (changes: QueryList<ElementRef>) => {
      const nodes = this._taskNodes.value;
      changes.forEach((x, i) => nodes[i].ref = x);
      this.refs.next(null);
    });
  }

  private alignTimeLine(): void {
    this.width = this.elem.nativeElement.offsetWidth;
    this.offsetToTimeline = this.width * 0.667;
    this.height = this.elem.nativeElement.offsetHeight;
    this.offsetPerHour = (this.height - this.numberOfHours * this.strokeWidth) / (this.numberOfHours + 1) + this.strokeWidth;

  }

  private alignTasks(): void {
    this._taskNodes.value.forEach(node => {
      node.duration = this.duration(node.task);
      node.height = this.heightOfTask(node.task);
      node.top = this.offsetTaskStart(node.task);
      node.left = this.offsetToTimeline - this.taskHalfWidth;
    } );
  }


  @HostListener('window:resize', ['$event'])
  private onWindowResize(event): void {
    this.render();
  }

  render(): void {
    this.alignTimeLine();
    this.alignTasks();
  }


  initTasks(): void {
    this._taskNodes.next( this.tasks
      .filter(task => task.begin)
      .map((task, i) => this.map(task, i)));
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
    const begin = new Date(task.begin);
    const offset = (1 + (begin.getHours() - this.startsFrom ) + (begin.getMinutes() / 60)) * this.offsetPerHour;
    return offset;
  }

  private duration(task: Task): string {
    if (!task.end || !task.begin) {
      return '';
    }
    const begin = new Date(task.begin);
    const end = new Date(task.end);
    const durationMinutes = (end.getTime() - begin.getTime()) / 60000;
    const hours = Math.floor(durationMinutes / 60);
    const minutes = durationMinutes % 60;
    let s = hours > 0 ? `${hours}h ` : '';
    s += minutes > 0 ? `${minutes}m` : '';
    return s;
  }

  private map(task: Task, i = this.tasks.length): TaskNode {
    const node = new TaskNode();
    node.task = {...task};
    node.color = this.colors[i];
    node.duration = this.duration(task);
    node.height = this.heightOfTask(task);
    node.top = this.offsetTaskStart(task);
    node.left = this.offsetToTimeline - this.taskHalfWidth;
    return node;
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
