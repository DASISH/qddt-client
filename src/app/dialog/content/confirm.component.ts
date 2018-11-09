import {DialogConfig} from '../dialog-config';
import {Component} from '@angular/core';
import {DialogRef} from '../dialog-ref';

@Component({
  selector: 'qddt-confirm',
  template: `
<div class="modal-content" style="color: black">
  <div class="row">
    <h4>Confirm</h4>
    <span>{{config.data.message}}</span>
  </div>
</div>
<div class="modal-footer" style="color: white">
  <button (click)="onClose('ok')"
          class="btn btn-default green waves-effect">
    <a><i class="close material-icons medium white-text">Yes</i></a>
  </button>
  <button (click)="onClose('cancel')"
    class="btn btn-default red waves-effect">
    <a><i class="close material-icons medium white-text">No</i></a>
  </button>
</div>
`
})
export class ConfirmComponent  {

  constructor(public config: DialogConfig, public dialog: DialogRef) {}

  onClose(value) {
    this.dialog.close(value);
  }
}
