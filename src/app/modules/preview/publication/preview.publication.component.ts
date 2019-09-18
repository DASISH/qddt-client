import { Component, Input } from '@angular/core';
import {ElementRevisionRef, PreviewService, Publication} from '../../../lib';

@Component({
  selector: 'qddt-preview-publication',
  templateUrl: './preview.publication.component.html',
})

export class PreviewPublicationComponent  {
  @Input() publication: Publication;


  constructor(private service: PreviewService) { }

  onViewDetail(element: ElementRevisionRef) {
    if (!element.element) {
      this.service.getRevisionByKind(element.elementKind, element.elementId, element.elementRevision).then(
        (result) => { element.element = result.entity; },
        (error) => { throw error; });
    }
  }


}
