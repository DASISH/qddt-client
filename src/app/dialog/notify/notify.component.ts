import { Component } from '@angular/core';
import { DialogConfig } from '../dialog-config';
import { DialogRef } from '../dialog-ref';

@Component({
  selector: 'qddt-notify',
  templateUrl: './notify.component.html'
})
export class NotifyComponent  {

  constructor(public config: DialogConfig, public dialog: DialogRef) {}

  onClose(value) {
    this.dialog.close(value);
  }
}
