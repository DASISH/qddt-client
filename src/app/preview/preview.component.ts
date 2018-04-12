import { Component, Input } from '@angular/core';
import { ElementEnumAware } from './preview.service';
import { IEntityAudit } from '../shared/classes/interfaces';
import { ElementKind } from '../shared/classes/enums';

@Component({
  selector: 'qddt-preview-element',
  moduleId: module.id,
  styles: [
    ':host /deep/ .row { margin-left: auto; margin-right: auto; margin-bottom: 2px; }'
  ],
  templateUrl: './preview.component.html',
})
@ElementEnumAware
export class PreviewComponent  {
  @Input() element: IEntityAudit;

  public  instanceRefEnum = ElementKind;

  public getElementKind(element: IEntityAudit): ElementKind {
    return ElementKind[element.classKind];
  }


}
