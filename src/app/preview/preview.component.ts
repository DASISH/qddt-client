import { Component, Input } from '@angular/core';
import {ElementKind, ElementEnumAware, QddtElement} from './preview.service';
import {PUBLICATION_TYPES} from '../publication/publication.service';

@Component({
  selector: 'qddt-preview-element',
  moduleId: module.id,
  styles: [
    `:host /deep/ .row {
       margin-left: auto;
       margin-right: auto;
       margin-bottom: 2px;
    }`
  ],
  templateUrl: './preview.component.html',
  providers: [],
})
@ElementEnumAware
export class PreviewComponent  {
  @Input() element: any;
  @Input() elementKind: ElementKind;


  public getElementString(kind: ElementKind): string {
    return typeof kind === 'string' ? kind : ElementKind[kind];
  }

  // public getElementKind(kind: ElementKind): ElementKind {
  //   return typeof kind === 'string' ? ElementKind[kind] : kind;
  // }

  public getElementKind(kind: ElementKind): any {
    return typeof kind === 'string' ? ElementKind[kind] : kind;
  }

  public getElementByKind(kind: ElementKind): QddtElement {
    if (typeof kind === 'string') {
        return PUBLICATION_TYPES.find(e =>  ElementKind[e.id] === kind);
    }  else {
        return null;
    }
  }

  public getElementByLabel(label: String): QddtElement {
      return PUBLICATION_TYPES.find(e => e.label === label);
  }

}
