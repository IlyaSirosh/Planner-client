import {animate, style, transition, trigger} from '@angular/animations';

export const optionStateTrigger = trigger('optionState', [
  transition(':enter', [
    style({
      height: 0,
      opacity: 0
    }),
    animate('200ms', style({
      height: '*'
    })),
    animate('100ms')
  ]),
  transition(':leave', [
    style({
      height: '*',
      opacity: 1
    }),
    animate('100ms', style({
      opacity: 0
    })),
    animate('200ms', style({
      height: 0,
      opacity: 0
    }))])
]);
