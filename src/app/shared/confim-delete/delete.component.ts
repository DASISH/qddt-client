import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MaterializeAction } from 'angular2-materialize';

@Component({
  selector: 'qddt-confirm-delete',
  moduleId: module.id,
  template: `
<a class="btn-flat btn-floating btn-medium waves-effect waves-light teal"
   (click)="showConfirmDeleting()"><i class="material-icons left medium" title="Delete" >delete_forever</i></a>
<div class="modal" materialize="modal" [materializeActions]="deleteAction">
  <div class="modal-content" style="color: black">
    <div class="row">
      <h4>Warning</h4>
      <span>Are you sure you want to delete [{{ element?.name }}] ?</span>
    </div>
  </div>
  <div class="modal-footer" style="color: white">
    <button (click)="onOk()"
            class="btn btn-default green modal-action modal-close waves-effect">
      <a><i class="close material-icons medium white-text">done</i></a>
    </button>
    <button (click)="onCancel()"
      class="btn btn-default red modal-action modal-close waves-effect">
      <a><i class="close material-icons medium white-text">close</i></a>
    </button>
  </div>
</div>
`,
  providers: []
})
export class ConfirmDeleteComponent  {
  @Input() element: any;
  @Output() confirmAction = new EventEmitter<string>();

  public deleteAction = new EventEmitter<string|MaterializeAction>();

  showConfirmDeleting() {
    this.deleteAction.emit({action: 'modal', params: ['open']});
  }

  onOk() {
    this.confirmAction.emit(this.element.id);
  }

  onCancel() {
    this.confirmAction.emit('');
  }
}




