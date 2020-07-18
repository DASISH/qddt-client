import { Component, EventEmitter, Input, Output, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';


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
export class DialogBigComponent implements AfterViewInit {
  @Input() modalId = Math.round(Math.random() * 10000).toString();
  @Input() confirm = false;
  @Output() dialogResult = new EventEmitter<{ result: boolean, ref: any }>();

  private instance: M.Modal;
  private ref;

  constructor(private router: Router) { }

  public open(event, ref) {
    if (event) {
      event.stopPropagation();
    }
    this.ref = ref
    this.instance.open();
  }

  public onClose(result: boolean) {
    this.dialogResult.emit({ result, ref: this.ref });
    this.instance.close();
  }

  ngAfterViewInit(): void {
    this.instance = M.Modal.init(document.getElementById(this.modalId),
      {
        inDuration: 400, outDuration: 300, startingTop: '5%', endingTop: '45%', preventScrolling: true,
        onOpenEnd: () => M.updateTextFields(),
        onCloseEnd: () => this.router.navigate([{ outlets: { popup: null } }])
      });
  }


}
