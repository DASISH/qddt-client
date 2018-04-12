import { Component, OnChanges, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { IEntityAudit } from '../../shared/elementinterfaces/entityaudit';
import { ElementKind, ElementRevisionRef, QDDT_ELEMENTS } from '../../shared/elementinterfaces/elements';

@Component({
  selector: 'qddt-revision-select',
  moduleId: module.id,
  templateUrl: './revision-select.component.html',
})

export class RevisionSelectComponent implements OnChanges{
  @Input() elementRevisions = [];
  @Input() showProgressBar = false;
  @Output() selectEvent = new EventEmitter<ElementRevisionRef>();
  @Output() dismissEvent = new EventEmitter<Boolean>();

  selectedRevision: number;
  selectedElement: IEntityAudit;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['elementRevisions']) {
      if (this.elementRevisions) {
        this.onSelectElementRevisions(this.elementRevisions[0].revisionNumber);
      }
    }
  }

  onSelectElementRevisions(event: any) {
    this.selectedRevision = +event;

    const result = this.elementRevisions.find((e: any) => e.revisionNumber === this.selectedRevision);
    if (result) {
      this.selectedElement = result.entity;
    } else if (this.elementRevisions.length > 0) {
      this.selectedElement = this.elementRevisions[0].entity;
      this.selectedRevision = this.elementRevisions[0].revisionNumber;
    }
  }

  onUseElement() {
    const elementType  = QDDT_ELEMENTS[this.getElementKind()];
    if (elementType) {
      const element = new ElementRevisionRef();
      element.elementId = this.selectedElement.id;
      element.elementRevision = this.selectedRevision;
      element.elementKind =  this.selectedElement.classKind;
      element.element = this.selectedElement;
      this.selectEvent.emit(element);
    }
  }

  onDismiss() {
    this.dismissEvent.emit(true);
  }

  private getElementKind(): ElementKind {
    return ElementKind[this.selectedElement.classKind];
  }

}
