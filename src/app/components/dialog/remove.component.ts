import { element } from 'protractor';
import {
  Component,
  Input,
  Output,
  EventEmitter,
  AfterViewInit,
} from '@angular/core';
import { IEntityAudit } from 'src/app/lib';

@Component({
  selector: 'qddt-confirm-remove',

  template: `
  <div id="{{modalId}}" class="modal">
    <div class="modal-content center grey-text text-darken-1">
      <i class="material-icons medium">remove_circle_outline</i>
      <h4>Confirm action</h4>
      <span [innerHTML]="'Are you sure you want to remove ['+ element?.name+ '] from this collections?'"></span>
    </div>
    <div class="modal-footer">
      <a class="btn-flat btn-medium waves-effect waves-light green white-text" (click)="onOk($event)">
        <span>sure</span>
      </a>
      <a class="btn-flat btn-medium waves-effect waves-light red white-text" (click)="onCancel($event)">
        <span>not now</span>
      </a>
    </div>
  </div>
  `,
})
export class ConfirmRemoveComponent implements AfterViewInit {
  @Input() modalId = Math.round(Math.random() * 10000).toString();
  @Input() element: IEntityAudit;
  @Output() dialogResult = new EventEmitter<IEntityAudit>();


  private instance = null;

  constructor() { }

  ngAfterViewInit() {
    this.instance = M.Modal.init(document.getElementById(this.modalId),
      {
        inDuration: 400, outDuration: 300, startingTop: '5%', endingTop: '45%', preventScrolling: true, opacity: 0.3,
        onOpenEnd: () => M.updateTextFields(),
      });
  }

  public showConfirmDeleting(event, element) {
    if (event) {
      event.stopPropagation();
    }
    if (element) {
      this.element = element;
    }
    this.instance.open();
  }

  onOk(event) {
    if (event) {
      event.stopPropagation();
    }
    this.dialogResult.emit(this.element);
    this.instance.close();
  }

  onCancel(event) {
    if (event) {
      event.stopPropagation();
    }
    this.dialogResult.emit(null);
    this.instance.close();
  }
}
