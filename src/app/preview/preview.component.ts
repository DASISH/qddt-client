import { Component, Input } from '@angular/core';
import { ElementKind , ElementEnumAware } from './preview.service';

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

  getElementKind(kind: ElementKind): string {
    console.log('Elementkind: ' + ElementKind[kind] + ' ' + kind);
    return ElementKind[kind];
  }

}
