import { Component, OnChanges, EventEmitter, Input, Output } from '@angular/core';
import { PublicationStatus, PublicationService, ElementTypes, PublicationElement } from './publication.service';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'qddt-publication-select',
  moduleId: module.id,
  templateUrl: './publication.select.component.html',
  providers: [PublicationService],
})

export class PublicationSelectComponent implements OnChanges {
  @Input() element: any;
  @Input() elementType: any;
  @Output() publicationElement: any = new EventEmitter<any>();
  @Output() dismissEvent: any = new EventEmitter<any>();

  elementRevisions: any[];
  elementRevision: any;
  selectedElement: any;

  constructor(private service: PublicationService) {
    this.elementRevisions = [];
  }

  ngOnChanges() {
    this.selectedElement = this.element;
    if (this.element !== null && this.element !== undefined
      && this.element.id !== null && this.element.id !== undefined) {
      this.service.getElementRevisions(this.elementType, this.element.id).subscribe((result: any) => {
        this.elementRevisions = result.content.sort((e1: any, e2: any) => e2.revisionNumber - e1.revisionNumber);
        this.onSelectElementRevisions();
      },
        (error: any) => { console.log('error'); });
    }
  }

  onSelectElementRevisions() {
    let r = this.elementRevision;
    if(typeof r === 'string') {
      r = parseInt(r);
    }
    this.elementRevision = r;
    let result = this.elementRevisions
      .find((e: any) => e.revisionNumber === r);
    if(result !== null && result !== undefined) {
      this.selectedElement = result.entity;
    } else if(this.elementRevisions.length > 0) {
      this.selectedElement = this.elementRevisions[0].entity;
      this.elementRevision = this.elementRevisions[0].revisionNumber;
    }
  }

  onUseElement() {
    let elementType: any = ElementTypes.find(e => e.id === this.elementType);
    if (elementType !== undefined) {
      let element: any = new PublicationElement();
      element.id = this.selectedElement.id;
      element.revisionNumber = this.elementRevision;
      element.elementKind = elementType.type;
      element.element = this.selectedElement;
      this.publicationElement.emit(element);
    }
  }

  onDismiss() {
    this.dismissEvent.emit(true);
  }

}
