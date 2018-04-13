import {Component, Input } from '@angular/core';
import { Publication } from '../../publication/publication.service';
import { PreviewService } from '../preview.service';
import { ElementRevisionRef } from '../../shared/classes/classes';
import { getElementKind } from '../../shared/classes/constants';

@Component({
  selector: 'qddt-preview-publication',
  moduleId: module.id,
  templateUrl: './preview.publication.component.html',
})

export class PreviewPublicationComponent  {
  @Input() publication: Publication;


  constructor(private service: PreviewService) { }

  onViewDetail(element: ElementRevisionRef) {
    if (!element.element) {
      this.service.getRevisionByKind(getElementKind(element.elementKind), element.elementId, element.elementRevision).then(
        (result) => { element.element = result.entity; },
        (error) => { throw error; });
    }
  }

  // public getQueryInfo(element: ElementKind| string): QueryInfo {
  //   return QDDT_QUERY_INFOES[getElementKind(element)];
  // }


}
