import { Component, OnInit,  EventEmitter } from '@angular/core';
// import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'qddt-dialogbox',
  templateUrl: './dialogbox.component.html',
  styleUrls: [ './dialogbox.component.css'],
  moduleId: module.id,
  // animations: [
  //   trigger('dialog', [
  //     transition('void => *', [
  //       style({ transform: 'scale3d(.3, .3, .3)' }),
  //       animate(100)
  //     ]),
  //     transition('* => void', [
  //       animate(100, style({ transform: 'scale3d(.0, .0, .0)' }))
  //     ])
  //   ])
  // ]
})
export class DialogBoxComponent  implements OnInit {
  // @Output() visibleChange: EventEmitter<string> = new EventEmitter<string>();
  public modalActions = new EventEmitter<any>();

  constructor() {
    //
  }

  ngOnInit() {
    //
  }

  open() {
    console.info('open');
    this.modalActions.emit({action:'modal', params:['open']});
    // this.visibleChange.emit('opened');
  }

  close() {
    console.info('close');
    this.modalActions.emit({action:'modal', params:['close']});
    // this.visibleChange.emit('closed');
  }

}
