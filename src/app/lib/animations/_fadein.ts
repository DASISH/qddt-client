import { trigger, animate, transition, style, state } from '@angular/animations';

export const fadeInAnimation =
  trigger('fadeInAnimation', [
    transition('void => *', [
      // css styles at start of transition
      style({ opacity: 0.3 }),

      // animation and styles at end of transition
      animate('.7s', style({ opacity: 1 }))
    ])
  ]);


