import { Component, OnChanges, EventEmitter, Input, Output } from '@angular/core';
import { SelectorsService } from '../selectors.service';
import { IEntityAudit } from '../../shared/elementinterfaces/entityaudit';
import { ElementKind, ElementRevisionRef, QDDT_ELEMENTS } from '../../shared/elementinterfaces/elements';


@Component({
  selector: 'qddt-revision-select',
  moduleId: module.id,
  templateUrl: './revision-select.component.html',
})

export class RevisionSelectComponent implements OnChanges {
  @Input() element: IEntityAudit;
  @Output() selectedEvent = new EventEmitter<ElementRevisionRef>();
  @Output() dismissEvent = new EventEmitter<Boolean>();

  elementRevisions = [];
  selectedRevision: number;
  selectedElement: IEntityAudit;
  showProgressBar = false;

  constructor(private service: SelectorsService) {
  }

  ngOnChanges() {

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

    const elementType  = QDDT_ELEMENTS.find(e => e.id === this.getElementKind());
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
    return ElementKind[this.element.classKind];
  }


}
