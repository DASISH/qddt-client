import {AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, Output, ViewChild} from '@angular/core';
import { getQueryInfo, IElement, IIdRef, IRevisionRef, PreviewService} from '../../lib';

@Component({
  selector: 'qddt-preview-dialog',

  template: `
    <div class="modal modal-fixed-footer" id="preview-id" #preview>
      <div class="modal-content teal-text" style="padding:36px;">
        <h4>Preview {{getClassName()}}</h4>
        <div class="row" *ngIf="element">
          <h5 class="grey-text">{{element?.name}}</h5>
          <qddt-preview-element class="grey-text" [element]="element"> </qddt-preview-element>
        </div>
      </div>
      <div class="modal-footer">
        <a class="modal-action modal-close waves-effect waves-purple btn-flat teal white-text" (close)="onClose()">Close</a>
      </div>
    </div>`
})

export class PreviewDialogComponent implements  OnChanges, AfterViewInit {
  @Input() reference: IIdRef|IRevisionRef|IElement;
  @Output() close = new EventEmitter<boolean>(false);

  element: any;
  @ViewChild('preview', {static: false}) modalPreview: ElementRef;

  private instance  = null;

  constructor(private service: PreviewService) { }

  ngAfterViewInit() {
    this.instance = M.AutoInit(this.modalPreview.nativeElement);
  }

  ngOnChanges(): void {
    // console.log('preview');
    if (!this.reference) { return; }
    if (this.isRevisionRef(this.reference)) {
      this.service.getRevisionByKind(this.reference.elementKind, this.reference.elementId, this.reference.elementRevision)
        .then(result => {
          this.element = result.entity;
          this.instance.open();
        });

    } else if (this.isIdRef(this.reference)) {
      this.service.getElementByKind(this.reference.elementKind, this.reference.elementId)
        .then(result => {
          this.element = result;
          this.instance.open();
        });

    } else {
      this.element = this.reference.element;
      this.instance.open();
    }
  }

  onClose() {
    this.reference = null;
    this.close.next(true);
  }

  getClassName(): string {
    if (this.reference) {
      return getQueryInfo(this.reference.elementKind).label;
    }
    return '?';
  }

  private isRevisionRef(element: IIdRef|IRevisionRef|IElement): element is IRevisionRef { // magic happens here
    return (<IRevisionRef>element).elementRevision !== undefined;
  }

  private isIdRef(element: IIdRef|IRevisionRef|IElement): element is IIdRef { // magic happens here
    return (<IIdRef>element).elementId !== undefined;
  }


}
