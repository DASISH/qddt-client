import { Component, OnChanges, EventEmitter, Input } from '@angular/core';
import { PublicationStatus, PublicationService, ElementTypes } from './publication.service';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'qddt-publication-preview',
  moduleId: module.id,
  templateUrl: './publication.preview.component.html',
  providers: [PublicationService],
})

export class PublicationPreviewComponent implements OnChanges {
  @Input() element: any;
  @Input() elementType: any;

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
    //
  }

}
