import { Router } from '@angular/router';
import { Component, EventEmitter, Input, Output, AfterViewInit } from '@angular/core';


@Component({
  selector: 'qddt-dialog',
  template: `
<div id="{{modalId}}" class="modal" style="{z-index: 1009;}">
  <div class="modal-content">
    <ng-content></ng-content>
  </div>
  <div class="modal-footer">
    <a *ngIf="confirm" class="btn-flat waves-effect waves-light green white-text" (click)="onClose(true)">
      <i class="material-icons medium white-text">done</i>
    </a>
    <a class="btn-flat btn-medium waves-effect waves-light red white-text" (click)="onClose(false)">
      <i class="material-icons medium white-text">close</i>
    </a>
  </div>
</div>
`
})
export class DialogComponent implements AfterViewInit {
  @Input() modalId = Math.round(Math.random() * 10000).toString();
  @Input() confirm = false;
  @Output() dialogResult = new EventEmitter<{ result: boolean, ref: any }>();

  public loading = false;
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
        inDuration: 750, outDuration: 1000, startingTop: '50%', endingTop: '10%', preventScrolling: true, opacity: 0.3,
        onOpenEnd: () => M.updateTextFields(),
        onCloseEnd: () => this.router.navigate([{ outlets: { popup: null } }])
      });
  }


}
