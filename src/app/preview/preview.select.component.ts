import { Component, OnChanges, EventEmitter, Input, Output } from '@angular/core';
import { ElementKind, QddtElement, PreviewService, QddtElements, ElementRevisionRef } from '../preview/preview.service';
import { IEntityAudit } from '../shared/ientityAudit';

@Component({
  selector: 'qddt-preview-select',
  moduleId: module.id,
  templateUrl: './preview.select.component.html',
})

export class PreviewSelectComponent implements OnChanges {
  @Input() element: IEntityAudit;
  @Output() selectedEvent = new EventEmitter<ElementRevisionRef>();
  @Output() dismissEvent = new EventEmitter<any>();

  elementRevisions: any[];
  selectedRevision: number;
  selectedElement: IEntityAudit;
  showProgressBar = false;

  constructor(private service: PreviewService) {
    this.elementRevisions = [];
  }

  ngOnChanges() {
    this.selectedElement = this.element;

    if (this.element && this.element.id) {
      this.showProgressBar = true;
      this.service.getElementRevisions(this.getElementKind(), this.element.id).then(
        (result: any) => {
          this.elementRevisions = result.content.sort((e1: any, e2: any) => e2.revisionNumber - e1.revisionNumber);
          this.onSelectElementRevisions(this.elementRevisions[0].revisionNumber);
          this.showProgressBar = false; },
        (error) => {
          this.showProgressBar = false;
          throw error; }
      );
    }
  }

  onSelectElementRevisions(event: any) {
    if (typeof event === 'string') {
      this.selectedRevision = parseInt(event);
    } else {
      this.selectedRevision = event;
    }

    const result = this.elementRevisions.find((e: any) => e.revisionNumber === this.selectedRevision);
    if (result) {
      this.selectedElement = result.entity;
    } else if (this.elementRevisions.length > 0) {
      this.selectedElement = this.elementRevisions[0].entity;
      this.selectedRevision = this.elementRevisions[0].revisionNumber;
    }
  }

  onUseElement() {
    // console.info('onUseElement ' + this.elementKind);
    const elementType  = QddtElements.find(e => e.id === this.getElementKind());
    if (elementType) {
      const element = new ElementRevisionRef();
      element.elementId = this.selectedElement.id;
      element.elementRevision = this.selectedRevision;
      element.elementKind =  this.selectedElement.classKind;
      element.element = this.selectedElement;
      this.selectedEvent.emit(element);
    }
  }

  onDismiss() {
    this.dismissEvent.emit(true);
  }

  private getElementKind(): ElementKind {
    return ElementKind[this.selectedElement.classKind];
  }


}
