import {
  Component,
  Input,
  Output,
  EventEmitter,
  AfterViewInit,
  ElementRef,
  ViewChild
} from '@angular/core';

@Component({
  selector: 'qddt-confirm-delete',

  template: `
    <a *ngIf="small;  else LARGE" class="btn-flat btn-small btn-floating btn-medium waves-effect waves-light red lighten-2"
      (click)="showConfirmDeleting()" ><i class="material-icons" title="Delete">delete_forever</i>
    </a>
    <ng-template #LARGE>
      <a class="btn-flat btn-floating btn-medium waves-effect waves-light red lighten-2"
        (click)="showConfirmDeleting()" ><i class="material-icons" title="Delete">delete_forever</i>
      </a>
    </ng-template>
    <div class="modal" #modaldelete>
      <div class="modal-content black-text">
        <div class="row">
          <h4>Warning</h4>
          <span>Are you sure you want to delete [{{ element?.name }}] ?</span>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn green waves-effect" (click)="onOk()">
          <a><i class="material-icons white-text">done</i></a>
        </button>
        <button class="btn btn-default red waves-effect" (click)="onCancel()">
          <a><i class="material-icons medium white-text">close</i></a>
        </button>
      </div>
    </div>
  `,
  providers: []
  // styles: [ 'a { color: white; text-align: center; vertical-align: middle;}' ]
})
export class ConfirmDeleteComponent implements AfterViewInit {
  @Input() element: any;
  @Input() small = false;
  @Output() confirmAction = new EventEmitter<string>();

  @ViewChild('modaldelete', { static: false }) modaldelete: ElementRef;

  private instance = null;

  constructor() {}

  ngAfterViewInit() {
    this.instance = M.Modal.init(this.modaldelete.nativeElement, {
      opacity: 0
    });
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
