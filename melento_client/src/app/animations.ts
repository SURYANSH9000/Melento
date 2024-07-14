import {
  trigger,
  transition,
  style,
  query,
  group,
  animate,
} from '@angular/animations';

export const slideInAnimation = trigger('routeAnimations', [
  transition('* <=> *', [
    query(
      ':enter, :leave',
      [
        style({
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
        }),
      ],
      { optional: true }
    ),
    group([
      query(
        ':enter',
        [
          style({ left: '-100%' }),
          animate('600ms ease-out', style({ left: '0%' })),
        ],
        { optional: true }
      ),
      query(':leave', [animate('600ms ease-out', style({ left: '100%' }))], {
        optional: true,
      }),
    ]),
  ]),
]);
