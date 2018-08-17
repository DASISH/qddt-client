import { Component, Input } from '@angular/core';
import { ElementEnumAware } from './preview.service';
import { IEntityAudit } from '../shared/classes/interfaces';
import { ElementKind } from '../shared/classes/enums';

@Component({
  selector: 'qddt-preview-element',
  moduleId: module.id,
  styles: [
    'table { table-layout: fixed;}',
    ':host /deep/ .row { min-height: 1rem; margin-left: auto; margin-right: auto; margin-bottom: 2px; }',
    '.row .col { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }',
    'ul .collapsible { margin:none; padding:5px; !important;}',
    'ul { border-color:lightyellow; }',
    'ul.question { border-color:#E8F5E9;}',
    'collapsible-header { display: flow-root; margin-bottom: 0px; margin-left: unset; }',
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
