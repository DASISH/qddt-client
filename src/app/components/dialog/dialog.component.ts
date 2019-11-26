import {Component, EventEmitter, Input, Output} from '@angular/core';

declare var $: any;

@Component({
  selector: 'qddt-dialog',
  template: `
<div id="{{modalId}}" class="modal">
  <div class="modal-content">
    <ng-content></ng-content>
  </div>
  <div class="modal-footer">
    <a *ngIf="confirm" class="btn btn-flat waves-effect waves-light green white-text" (click)="onClose(true)">
      <i class="material-icons medium white-text">done</i>
    </a>
    <a class="brn btn-flat btn-medium waves-effect waves-light red white-text" (click)="onClose(false)">
      <i class="material-icons medium white-text">close</i>
    </a>
  </div>
</div>
`
})
export class DialogComponent {
  @Input() modalId = Math.round( Math.random() * 10000).toString();
  @Input() confirm = false;
  @Output() closeState = new EventEmitter<boolean>();


  constructor() {}

  public onClose(status: boolean) {
     this.closeState.emit(status);
     $('#' + this.modalId).modal('close');
  }

  public open() {
    $('#' + this.modalId).modal('open');
  }
}
