import { Component, OnChanges, EventEmitter, Input, Output } from '@angular/core';
import { PublicationService, PublicationElement, PUBLICATION_TYPES } from './publication.service';
import { ElementKind, QddtElementType } from '../shared/preview/preview.service';

@Component({
  selector: 'qddt-publication-select',
  moduleId: module.id,
  templateUrl: './publication.select.component.html',
  providers: [PublicationService],
})

export class PublicationSelectComponent implements OnChanges {
  @Input() element: any;
  @Input() elementKind: ElementKind;
  @Output() publicationElement: any = new EventEmitter<any>();
  @Output() dismissEvent: any = new EventEmitter<any>();

  elementRevisions: any[];
  elementRevision: any;
  selectedElement: any;
  selectedElementLabel: string;
  showProgressBar= false;

  constructor(private service: PublicationService) {
    this.elementRevisions = [];
  }

  ngOnChanges() {
    this.selectedElement = this.element;
    this.showProgressBar = true;
    if (this.element !== null && this.element !== undefined
      && this.element.id !== null && this.element.id !== undefined) {
      this.service.getElementRevisions(this.elementKind, this.element.id).then((result: any) => {
        this.elementRevisions = result.content.sort((e1: any, e2: any) => e2.revisionNumber - e1.revisionNumber);
        this.onSelectElementRevisions(this.elementRevisions[0].revisionNumber);
          this.showProgressBar = false;
      });
    }
  }

  onSelectElementRevisions(event: any) {
    let r = event;
    if (typeof r === 'string') {
      r = parseInt(r);
    }
    this.elementRevision = r;
    const result = this.elementRevisions
      .find((e: any) => e.revisionNumber === r);
    if (result !== null && result !== undefined) {
      this.selectedElement = result.entity;
    } else if (this.elementRevisions.length > 0) {
      this.selectedElement = this.elementRevisions[0].entity;
      this.elementRevision = this.elementRevisions[0].revisionNumber;
    }
  }

  onUseElement() {
    // console.info('onUseElement ' + this.elementKind);
    const elementType: QddtElementType = PUBLICATION_TYPES.find(e => e.id === this.elementKind);
    if (elementType !== undefined) {
      const element: any = new PublicationElement();
      element.id = this.selectedElement.id;
      element.revisionNumber = this.elementRevision;
      element.elementKind =  elementType.label;
      element.element = this.selectedElement;
      this.selectedElementLabel = elementType.label;
      this.publicationElement.emit(element);
    }
  }

  onDismiss() {
    this.dismissEvent.emit(true);
  }

}
