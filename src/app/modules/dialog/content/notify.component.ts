import { Component } from '@angular/core';
import { DialogConfig } from '../dialog-config';
import { DialogRef } from '../dialog-ref';

@Component({
  selector: 'qddt-notify',
  template: `
<div class="modal-content" style="color: black">
  <div class="row">
    <h4>Information</h4>
    <span>{{config.data.message}}</span>
  </div>
</div>
<div class="modal-footer" style="color: white">
  <button (click)="onClose('ok')"
          class="btn btn-default green waves-effect">
    <a><i class="close material-icons medium white-text">OK</i></a>
  </button>
</div>
`})
export class NotifyComponent  {

  constructor(public config: DialogConfig, public dialog: DialogRef) {}

  onClose(value) {
    this.dialog.close(value);
  }
}
