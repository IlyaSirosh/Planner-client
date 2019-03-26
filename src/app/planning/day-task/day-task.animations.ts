import {animate, style, transition, trigger} from '@angular/animations';

export const taskButtonsStateTrigger = trigger( 'taskButtonsState', [
  transition(':enter', [
    style({
      width: 0,
      opacity: 0
    }),
    animate('200ms ease-out')
  ]),
  transition(':leave', [
    style({
      width: '*',
      opacity: 1
    }),
    animate('200ms ease-out', style({
      width: 0,
      opacity: 0
    }) )
  ]),
]);


export const notesStateTrigger = trigger('notesState', [
  transition('void => hidden', [
    style({
      height: 0,
      opacity: 0
    }),
    animate('200ms')
  ]),
  transition('hidden => void', [
    style({
      height: '*',
      opacity: 1
    }),
    animate('200ms', style({
      height: 0,
      opacity: 0
    }) )
  ]),
])
