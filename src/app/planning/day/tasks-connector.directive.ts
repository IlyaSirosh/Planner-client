import {AfterContentInit, ContentChild, ContentChildren, Directive, ElementRef, Input, QueryList, Renderer2} from '@angular/core';
import {DayTimeRangeComponent} from './day-time-range/day-time-range.component';
import {DayTaskComponent} from './day-task/day-task.component';

@Directive({
  selector: '[tasksConnector]'
})
export class TasksConnectorDirective implements AfterContentInit {
  @ContentChild(DayTimeRangeComponent) timeRange: DayTimeRangeComponent;
  @ContentChildren(DayTaskComponent) tasks: QueryList<DayTaskComponent>;
  svg: HTMLElement;
  constructor(private elem: ElementRef, private renderer: Renderer2) { }

  ngAfterContentInit() {
    console.log(this.timeRange);
    this.createSVG();

  }

  createSVG() {
    const svg = this.renderer.createElement('svg', 'http://www.w3.org/2000/svg');
    this.renderer.setAttribute(svg, 'position', 'absolute');
    this.renderer.setAttribute(svg, 'top', '0px');
    this.renderer.setAttribute(svg, 'left', '0px');
    this.renderer.setAttribute(svg, 'width', this.elem.nativeElement.offsetWidth);
    this.renderer.setAttribute(svg, 'height', this.elem.nativeElement.offsetHeight);
    this.renderer.appendChild(this.elem.nativeElement, svg);
    this.svg = svg;
  }


  connect(rectRef: ElementRef, taskRef: ElementRef, color, tension) {
    const left = rectRef.nativeElement;
    const right = taskRef.nativeElement;

    const leftPos = this.findAbsolutePosition(left);
    let x1 = leftPos.x;
    let y1 = leftPos.y;
    x1 += left.getBoundingClientRect().width;
    y1 += (left.getBoundingClientRect().height / 2);

    const rightPos = this.findAbsolutePosition(right);
    let x2 = rightPos.x;
    let y2 = rightPos.y;
    x2 += right.getBoundingClientRect().width;
    y2 += (right.offsetHeight / 2);


    this.drawCurvedLine(x1, y1, x2, y2, color, tension);
  }


  drawCurvedLine(x1, y1, x2, y2, color, tension) {
    const shape = this.renderer.createElement('path', 'svg');

    const delta = (x2 - x1) * tension;
    const hx1 = Math.floor(x1 + delta);
    const hy1 = Math.floor(y1);
    const hx2 = Math.floor(x2 - delta);
    const hy2 = Math.floor(y2);
    // const path = `M${x1} ${y1} C${hx1} ${hy1} ${hx2} ${hy2} ${x2} ${y2}`;
    const path = `M${Math.floor(x1)} ${Math.floor(y1)} L${Math.floor(x2)} ${Math.floor(y2)}`;

    this.renderer.setAttribute(shape, 'd', path);
    // this.renderer.setAttribute(shape, 'fill', 'none');
    this.renderer.setAttribute(shape, 'stroke', color);
    this.renderer.setAttribute(shape, 'stroke-width', '1');
    this.renderer.appendChild( this.svg, shape);

  }

  findAbsolutePosition(htmlElement) {
    console.log('start');
    console.log(htmlElement);
    console.log(this.elem.nativeElement);
    let x_pos = 0;
    let y_pos = 0;
    let el = htmlElement;
    while (el !== this.elem.nativeElement ) {
      const rect = el.getBoundingClientRect();
      console.log(el);
      console.log('-');
      if  (el.offsetLeft) {
        x_pos += rect.left;
      }
      if (el.offsetTop) {
        y_pos += rect.top;
      }
      el = el.parentNode;
    }
    console.log({x: x_pos, y: y_pos});
    console.log('end');
    return {x: x_pos, y: y_pos};
  }

}
