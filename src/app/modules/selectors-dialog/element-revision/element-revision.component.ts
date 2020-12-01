import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { ElementKind, ElementRevisionRef, IElement, IRevisionRef, getQueryInfo, getElementKind } from '../../../lib';


@Component({
  selector: 'qddt-element-collection-dialog',
  template: `
  <!-- Modal Structure -->
  <div  id="MODAL-{{modalId}}" class="modal modal-fixed-footer">
    <div *ngIf="source" class="modal-content white black-text" >
      <h4>Select {{getLabelByKind()}} & version</h4>
      <qddt-element-revision-select
          [source] = "source"
          [xmlLang]="xmlLang"
          (revisionSelectedEvent)="revisionSelectedEvent($event)"
          (dismissEvent) ="onDismiss()">
      </qddt-element-revision-select>
    </div>
    <div class="modal-footer">
      <button
        class="btn btn-default red modal-action modal-close waves-effect waves-red" (click)="onDismiss()" >
        Dismiss
      </button>
    </div>
  </div>
`,
})
export class ElementRevisionSelectComponent implements OnChanges {
  @Input() source: IElement | IRevisionRef | null;
  @Input() xmlLang = 'none';
  @Output() revSelectEvent = new EventEmitter<ElementRevisionRef>();

  public readonly modalId = Math.round(Math.random() * 10000);

  // tslint:disable-next-line:variable-name
  private _modalRef: M.Modal;

  public readonly getKind = () => (this.source && this.source.elementKind) ? getElementKind(this.source.elementKind) : ElementKind.NONE;
  public readonly getLabelByKind = () => (this.getKind() !== ElementKind.NONE) ? getQueryInfo(this.getKind()).label : 'Item?';

  constructor() {
    // console.log('ElementRevisionSelectComponent::CNSTR');
  }

  get modalRef(): M.Modal {
    if (!(this._modalRef)) {
      this._modalRef = M.Modal.init(document.querySelector('#MODAL-' + this.modalId),
        {
          inDuration: 750, outDuration: 750, startingTop: '50%', endingTop: '10%', preventScrolling: true, opacity: 0.3
        });
    }
    return this._modalRef;
  }

  public revisionSelectedEvent(ref: ElementRevisionRef) {
    this.source = null;
    this.modalRef.close();
    this.revSelectEvent.emit(ref);
  }

  public onDismiss() {
    this.source = null;
    this.modalRef.close();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ((changes.source) && changes.source.currentValue) {
      this.modalRef.open();
    }
  }

}
