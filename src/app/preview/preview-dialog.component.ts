import { Component, EventEmitter, Input, OnChanges } from '@angular/core';
import {  PreviewService } from './preview.service';
import { MaterializeAction } from 'angular2-materialize';
import { getQueryInfo, IElement, IIdRef, IRevisionRef} from '../classes';

@Component({
  selector: 'qddt-preview-dialog',

  template: `
    <div class="modal modal-fixed-footer" id="preview-{{element?.id}}"
         materialize="modal" [materializeActions]="basedonActions">
      <div class="modal-content teal-text" style="padding:36px;">
        <h4>Preview {{getClassName()}}</h4>
        <div class="row" *ngIf="element">
          <h5 class="grey-text">{{element?.name}}</h5>
          <qddt-preview-element class="grey-text" [element]="element"> </qddt-preview-element>
        </div>
      </div>
      <div class="modal-footer">
        <a class="modal-action modal-close waves-effect waves-purple btn-flat teal white-text">Close</a>
      </div>
    </div>`
    ,
})

export class PreviewDialogComponent implements  OnChanges {
  @Input() reference: IIdRef|IRevisionRef|IElement;

  basedonActions = new EventEmitter<string|MaterializeAction>();
  element: any;

  constructor(private service: PreviewService) { }

  ngOnChanges(): void {
    if (!this.reference) { return; }

    if (this.isRevisionRef(this.reference)) {
      this.service.getRevisionByKind(this.reference.elementKind, this.reference.elementId, this.reference.elementRevision)
        .then(result => {
          this.element = result.entity;
          this.basedonActions.emit({action: 'modal', params: ['open']});
        });

    } else if (this.isIdRef(this.reference)) {
      this.service.getElementByKind(this.reference.elementKind, this.reference.elementId)
        .then(result => {
          this.element = result;
          this.basedonActions.emit({action: 'modal', params: ['open']});
        });

    } else {
      this.element = this.reference.element;
      this.basedonActions.emit({action: 'modal', params: ['open']});
    }
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
