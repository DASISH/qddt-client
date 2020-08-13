import {
  Component,
  Input,
  Output,
  EventEmitter,
  AfterViewInit,
  ElementRef,
  ViewChild
} from '@angular/core';
import { IEntityAudit } from 'src/app/lib';

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
    <div class="modal-content grey-text text-darken-1 center-align">
      <h4><i class="material-icons medium prefix">delete_forever</i>Confirm action</h4>
      <br>
      <p class="center-align" style="font-size: large;" [innerHTML]="'Are you sure you want to delete ['+ element?.name+ '] ?'"></p>
    </div>
    <div class="modal-footer">
      <a class="btn-flat btn-medium waves-effect waves-light green white-text" (click)="onOk()">
        <span>sure</span>
      </a>
      <a class="btn-flat btn-medium waves-effect waves-light red white-text" (click)="onCancel()">
        <span>not now</span>
      </a>
    </div>
  </div>
`,
})
export class ConfirmDeleteComponent implements AfterViewInit {
  @Input() element: IEntityAudit;
  @Input() small = false;
  @Output() confirmAction = new EventEmitter<IEntityAudit>();

  @ViewChild('modaldelete', { static: false }) modaldelete: ElementRef;

  private instance = null;

  constructor() { }

  ngAfterViewInit() {
    this.instance = M.Modal.init(this.modaldelete.nativeElement,
      {
        inDuration: 500, outDuration: 400, startingTop: '5%', endingTop: '40%', preventScrolling: true, opacity: 0.3,
        onOpenEnd: () => M.updateTextFields(),
      });
  }

  public showConfirmDeleting() {
    this.instance.open();
  }

  onOk() {
    // console.log(this.element || JSON);
    this.confirmAction.emit(this.element);
    this.instance.close();
  }

  onCancel() {
    this.confirmAction.emit(null);
    this.instance.close();
  }
}
