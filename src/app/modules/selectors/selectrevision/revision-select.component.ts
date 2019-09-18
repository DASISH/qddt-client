import { Component, OnChanges, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import {ElementKind, ElementRevisionRef, getQueryInfo, IEntityEditAudit } from '../../../lib';


@Component({
  selector: 'qddt-revision-select',
  templateUrl: './revision-select.component.html',
})

export class RevisionSelectComponent implements OnChanges {
  @Input() elementRevisions = [];
  @Input() showProgressBar = false;
  @Output() selectEvent = new EventEmitter<ElementRevisionRef>();
  @Output() dismissEvent = new EventEmitter<Boolean>();

  public show = false;
  selectedRevision: number;
  selectedElement: IEntityEditAudit;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['elementRevisions']) {
      if ( (this.elementRevisions)  && (this.elementRevisions.length > 0 )) {
        this.onSelectElementRevisions(this.elementRevisions[0].revisionNumber);
      } else {
        this.show = false;
      }
    }
  }

  onSelectElementRevisions(event: any) {
    this.selectedRevision = +event;
    this.show = true;

    const result = this.elementRevisions.find((e: any) => e.revisionNumber === this.selectedRevision);
    if (result) {
      this.selectedElement = result.entity;
    } else if (this.elementRevisions.length > 0) {
      this.selectedElement = this.elementRevisions[0].entity;
      this.selectedRevision = this.elementRevisions[0].revisionNumber;
    }
  }

  onUseElement() {
    const qi =  getQueryInfo(this.selectedElement.classKind);
    if (qi) {
      const element = new ElementRevisionRef();
      element.elementId = this.selectedElement.id;
      element.elementRevision = this.selectedRevision;
      element.elementKind =  this.selectedElement.classKind;
      element.element = this.selectedElement;
      if (qi.id === ElementKind.QUESTION_CONSTRUCT) {
        element.name = this.selectedElement.name + ' - ' + this.selectedElement['questionItem']['question'];
      } else {
        element.name = this.selectedElement.name;
      }
      element.version = this.selectedElement.version;
      this.selectEvent.emit(element);
      this.show = false;
    }
  }

  onDismiss() {
    this.show = false;
    this.dismissEvent.emit(true);
  }

}
