import {Directive, ElementRef, HostListener, OnDestroy} from '@angular/core';

@Directive({
  selector: '[appTaskScrollable]'
})
export class TaskScrollableDirective implements OnDestroy {
  private fn;
  constructor(private elem: ElementRef) { }

  @HostListener('scroll')
  onScroll() {
    if (this.fn) {
      this.fn();
    }
  }

  addEventListener(fn: () => any): void {
    this.fn = fn;

  }

  removeEventListener(): void {
    if (this.fn) {
      this.fn = null;
    }
  }

  ngOnDestroy() {
    this.removeEventListener();
  }
}
