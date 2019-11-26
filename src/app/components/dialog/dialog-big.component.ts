import {Component, EventEmitter, Input, Output} from '@angular/core';

declare var $: any;

@Component({
  selector: 'qddt-dialog-big',
  template: `
<div id="{{modalId}}" class="modal modal-fixed-footer" >
  <div class="modal-content">
    <ng-content></ng-content>
  </div>
  <div class="modal-footer">
    <a *ngIf="confirm" class="btn btn-flat waves-effect waves-light green white-text" (click)="onClose(true)">
      OK
    </a>
    <a class="brn btn-flat btn-medium waves-effect waves-light red white-text" (click)="onClose(false)">
      Dismiss
    </a>
  </div>
</div>
`
})
export class DialogBigComponent {
  @Input() modalId = Math.round( Math.random() * 10000).toString();
  @Input() confirm = false;
  @Output() closeState = new EventEmitter<boolean>();


  constructor() {}

  public onClose(status: boolean) {
    this.closeState.emit(status);
    $('#' + this.modalId).modal('close');
  }

}
