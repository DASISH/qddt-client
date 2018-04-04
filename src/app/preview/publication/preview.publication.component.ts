import {Component, Input } from '@angular/core';
import { Publication } from '../../publication/publication.service';
import { PreviewService } from '../preview.service';
import {ElementKind, ElementRevisionRef, QDDT_ELEMENTS, QddtElement} from '../../shared/elementinterfaces/elements';

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
      this.service.getRevisionByKind(this.getElementKind(element.elementKind), element.elementId, element.elementRevision).then(
        (result) => { element.element = result.entity; },
        (error) => { throw error; });
    }
  }

  public getQddtElement(element: ElementKind| string): QddtElement {
    const  kind =  this.getElementKind(element);
    return QDDT_ELEMENTS.find( qe => qe.id === kind);
  }

  public getElementKind(element: ElementKind| string): ElementKind {
    if (typeof element === 'string') {
      return ElementKind[element];
    }
    return element;
  }
}
