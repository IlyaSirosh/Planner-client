import {
  AfterContentInit, ContentChild, ContentChildren, Directive, ElementRef, HostListener, Input, OnDestroy, OnInit, QueryList,
  Renderer2
} from '@angular/core';
import {DayTimeRangeComponent, TaskNode} from './day-time-range/day-time-range.component';
import {DayTaskComponent} from '../day-task/day-task.component';
import {distinctUntilKeyChanged, shareReplay, skipUntil, skipWhile, switchMap, tap} from 'rxjs/internal/operators';
import {TaskScrollableDirective} from './task-scrollable.directive';
import {PlanningService} from '../planning.service';
import {combineLatest, of} from 'rxjs';
import {TaskComponent} from '../task-list/task/task.component';

@Directive({
  selector: '[tasksConnector]'
})
export class TasksConnectorDirective implements AfterContentInit, OnInit , OnDestroy, AfterContentInit {
  @Input() scrollable: HTMLElement;
  // @ContentChild(TaskScrollableDirective) scrollable: TaskScrollableDirective;
  @ContentChild(DayTimeRangeComponent) timeRange: DayTimeRangeComponent;
  @ContentChildren(DayTaskComponent, {descendants: true}) tasks: QueryList<DayTaskComponent>;
  svg: HTMLElement;
  connectors: object[] = [];
  private _nodes: TaskNode[] = [];
  constructor(private elem: ElementRef, private renderer: Renderer2, private planningService: PlanningService) {
    document.addEventListener('fullscreenchange', this.render.bind( this));

    /* Firefox */
    document.addEventListener('mozfullscreenchange', this.render.bind( this));

    /* Chrome, Safari and Opera */
    document.addEventListener('webkitfullscreenchange', this.render.bind( this));

    /* IE / Edge */
    document.addEventListener('msfullscreenchange',  this.render.bind( this));

    // this.renderer.listen(this.elem.nativeElement, 'onresize', this.render.bind(this));
  }

  @HostListener('resize')
  onWindowResize(): void {
    this.render();
  }


  ngOnInit() {
  }

  ngOnDestroy() {

  }

  set nodes(values: TaskNode[]) {
    // console.log('set ', values);
    this._nodes = values;
  }

  get nodes() {
    return this._nodes;
  }

  ngAfterContentInit() {
    this.createSVG();
    this.planningService.timeRange = this.timeRange;
    console.log(`tasks size ${this.tasks.length}`);

    combineLatest(
      this.timeRange.$taskNodes
        .pipe(
          tap((x) => console.log(x)),
          tap(nodes => this.nodes = nodes ? [...nodes] : []),
          switchMap(() => this.timeRange.$refs)
        ),
      this.tasks.changes
        .pipe(
          tap((x) => console.log(x))
        )
    ).subscribe( () => {
        this.render();
      });

    if (this.scrollable) {
      this.scrollable.addEventListener( 'scroll', this.render.bind(this));
    }
  }

  createSVG() {
    const svg = this.renderer.createElement('svg', 'svg');
    this.renderer.setStyle(svg, 'position', 'absolute');
    this.renderer.setAttribute(svg, 'top', '0');
    this.renderer.setAttribute(svg, 'left', '0');
    // this.renderer.setAttribute(svg, 'right', '0');
    // this.renderer.setAttribute(svg, 'bottom', '0');
    this.renderer.setStyle(svg, 'width', this.elem.nativeElement.offsetWidth);
    this.renderer.setStyle(svg, 'height', this.elem.nativeElement.offsetHeight);
    this.renderer.setStyle(svg, 'z-index', '1');
    this.renderer.appendChild(this.elem.nativeElement, svg);
    this.svg = svg;
  }

  render(): void {
    console.log('render');
    this.renderer.setStyle(this.svg, 'width', this.elem.nativeElement.offsetWidth);
    this.renderer.setStyle(this.svg, 'height', this.elem.nativeElement.offsetHeight);
    this.removeAllConnections();
    this.nodes.forEach(node => {
      const task = this.tasks.find( item => item.task.id === node.task.id);
      if (task && node.ref) {
        this.connect(node.ref, task.elem, node.color);
      }
    });
  }


  private removeAllConnections(): void {
    this.connectors.forEach(el => {
      this.renderer.removeChild(this.svg, el);
    });
    this.connectors = [];
  }

  connect(rectRef: ElementRef, taskRef: ElementRef, color) {
    const tension = 0.5;
    const left = rectRef.nativeElement;
    const right = taskRef.nativeElement;

    let x1 = left.x.baseVal.value;
    let y1 = left.y.baseVal.value;
    x1 += left.getBoundingClientRect().width;
    y1 += (left.getBoundingClientRect().height / 2);

    const rightPos = this.findAbsolutePosition(right);
    const x2 = rightPos.x;
    let y2 = rightPos.y;
    y2 += right.getBoundingClientRect().height / 3;

    this.drawCurvedLine(x1, y1, x2, y2, color, tension);
  }


  drawCurvedLine(x1, y1, x2, y2, color, tension) {
    const shape = this.renderer.createElement('path', 'svg');

    const delta = (x2 - x1) * tension;
    const hx1 = Math.floor(x1 + delta);
    const hy1 = Math.floor(y1);
    const hx2 = Math.floor(x2 - delta);
    const hy2 = Math.floor(y2);
    const path = `M${x1} ${y1} C${hx1} ${hy1} ${hx2} ${hy2} ${x2} ${y2}`;
    // const path = `M${Math.floor(x1)} ${Math.floor(y1)} L${Math.floor(x2)} ${Math.floor(y2)}`;

    this.renderer.setAttribute(shape, 'd', path);
    this.renderer.setAttribute(shape, 'fill', 'none');
    this.renderer.setAttribute(shape, 'stroke', color);
    this.renderer.setAttribute(shape, 'stroke-width', '1.4');
    this.renderer.appendChild( this.svg, shape);
    this.renderer.setStyle(shape, 'transition', 'd 50ms');
    this.connectors.push(shape);

  }

  findAbsolutePosition(htmlElement) {
    let yPos = 0;
    let xPos = 0;
    let el = htmlElement;
    while (el !== this.elem.nativeElement ) {
      yPos += el.offsetTop;
      xPos += el.offsetLeft;
      el = this.renderer.parentNode(el);
    }
    if (this.scrollable) {
      yPos -= this.scrollable.scrollTop;
    }
    return {x: xPos, y: yPos };
  }

}


