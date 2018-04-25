import { Component, Input } from '@angular/core';
import { PreviewService } from '../preview.service';
import { ElementRevisionRef, QueryInfo} from '../../shared/classes/classes';
import { getElementKind, QDDT_QUERY_INFOES} from '../../shared/classes/constants';
import { ElementKind } from '../../shared/classes/enums';
import { Publication } from '../../publication/publication.classes';

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

  public getQueryInfo(element: ElementKind): QueryInfo {
    return QDDT_QUERY_INFOES[getElementKind(element)];
  }


}
