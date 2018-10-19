import { Component, Input } from '@angular/core';
import { PreviewService } from '../preview.service';
import { Publication } from '../../publication/publication.classes';
import { ElementKind, ElementRevisionRef, getElementKind, QDDT_QUERY_INFOES, QueryInfo} from '../../shared/classes';

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
      this.service.getRevisionByKind(element.elementKind, element.elementId, element.elementRevision).then(
        (result) => { element.element = result.entity; },
        (error) => { throw error; });
    }
  }

  public getQueryInfo(element: ElementKind): QueryInfo {
    return QDDT_QUERY_INFOES[getElementKind(element)];
  }


}
