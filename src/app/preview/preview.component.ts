import { Component, Input } from '@angular/core';
import { ElementEnumAware } from './preview.service';
import { IEntityAudit } from '../interfaces/entityAudit';
import { ElementKind, QddtElement, QDDT_ELEMENTS } from '../interfaces/elements';

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
  @Input() element: IEntityAudit;

  public getElementKind(element: IEntityAudit): ElementKind {
    return ElementKind[element.classKind];
  }

  public getElementByKind(kind: ElementKind): QddtElement {
    if (typeof kind === 'string') {
        return QDDT_ELEMENTS.find(e =>  ElementKind[e.id] === kind);
    }  else {
        return null;
    }
  }

}
