import { Component, Input } from '@angular/core';
import { PreviewService } from '../preview.service';
import { Publication } from '../../modules/publication/publication.classes';
import { ElementRevisionRef, getQueryInfo } from '../../classes';

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
