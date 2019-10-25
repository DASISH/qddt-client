import {Component, Input, Output, EventEmitter, AfterViewInit, ElementRef, ViewChild} from '@angular/core';

@Component({
  selector: 'qddt-confirm-delete',

  template: `
<a class="btn-flat btn-floating btn-medium waves-effect waves-light teal"  (click)="showConfirmDeleting()">
    <i class="material-icons left medium" title="Delete" >delete_forever</i></a>
<div class="modal"  #modaldelete>
  <div class="modal-content black-text">
    <div class="row">
      <h4>Warning</h4>
      <span>Are you sure you want to delete [{{ element?.name }}] ?</span>
    </div>
  </div>
  <div class="modal-footer" >
    <button class="btn green waves-effect" (click)="onOk()">
      ok<a><i class="material-icons ">done</i></a>
    </button>
    <button class="btn btn-default red waves-effect"  (click)="onCancel()">
      cancel<a><i class="material-icons">close</i></a>
    </button>
  </div>
</div>
`,
  providers: [],
  styles: [ 'a { color: white; text-align: center; vertical-align: middle;}' ]
})
export class ConfirmDeleteComponent implements AfterViewInit   {
  @Input() element: any;
  @Output() confirmAction = new EventEmitter<string>();

  @ViewChild('modaldelete', {static: false}) modaldelete: ElementRef;

  private instance  = null;

  constructor() {}

  ngAfterViewInit() {
    this.instance = M.Modal.init(this.modaldelete.nativeElement);
  }


  public showConfirmDeleting() {
      this.instance.open();
  }

  onOk() {
    this.confirmAction.emit(this.element.id);
    this.instance.close();
  }

  onCancel() {
    this.confirmAction.emit('');
    this.instance.close();
  }
}




