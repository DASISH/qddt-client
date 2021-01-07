import { trigger, animate, transition, style, state } from '@angular/animations';

export const fadeInAnimation =
  trigger('fadeInAnimation', [
    transition('void => *', [
      // css styles at start of transition
      style({ opacity: 0.7 }),

      // animation and styles at end of transition
      animate('.7s', style({ opacity: 1 }))
    ])
  ]);


export const fadeOutAnimation =
  trigger('fadeOutAnimation', [
    transition('void => *', [
      // css styles at start of transition
      style({ opacity: 1 }),

      // animation and styles at end of transition
      animate('.3s', style({ opacity: 0.7 }))
    ])
  ]);
