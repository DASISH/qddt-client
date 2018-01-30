import { Component, EventEmitter, Input, OnChanges } from '@angular/core';
import { ElementEnumAware, ElementKind, PreviewService, QddtElement, QddtElements } from './preview.service';
import { MaterializeAction } from 'angular2-materialize';

@Component({
  selector: 'qddt-preview-dialog',
  moduleId: module.id,
  template: `
    <div class="modal modal-fixed-footer" id="preview-{{basedonObject?.id}}"
         materialize="modal" [materializeActions]="basedonActions">
      <div class="modal-content teal-text">
        <h4>Object details</h4>
        <div class="row" *ngIf="basedonObject">
          <h5 class="row grey-text">{{basedonObject?.name}}</h5>
          <qddt-preview-element class="grey-text" [element]="basedonObject" [elementKind]="elementKind"> </qddt-preview-element>
        </div>
      </div>
      <div class="modal-footer">
        <a class="modal-action modal-close waves-effect waves-purple btn-flat teal white-text">
          Close
        </a>
      </div>
    </div>`
    ,
})
@ElementEnumAware
export class PreviewDialogComponent implements  OnChanges {
  @Input() elementRef: any;
  @Input() basedonObject: any;
  @Input() elementKind: ElementKind;

  basedonActions = new EventEmitter<string|MaterializeAction>();

  constructor(private service: PreviewService) {
    //
  }

  ngOnChanges(): void {
    if (this.elementRef) {
      const qe: QddtElement = QddtElements.find(e => ElementKind[e.id] === this.elementRef.type);
      this.elementKind = qe.id;
      this.service.getRevisionByKind(qe.id, this.elementRef.id, this.elementRef.rev)
        .then(result => {
          this.basedonObject = result.entity;
          this.basedonActions.emit({action: 'modal', params: ['open']});
        });
    } else if (this.basedonObject && this.elementKind) {
      this.basedonActions.emit({action: 'modal', params: ['open']});
    }
  }
}
