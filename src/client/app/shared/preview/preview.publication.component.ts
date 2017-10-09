import { Component, Input } from '@angular/core';
import { ElementKind , ElementEnumAware } from './preview.service';

@Component({
  selector: 'qddt-publication-preview',
  moduleId: module.id,
  styles: [
    `:host /deep/ .row {
       margin-left: auto;
       margin-right: auto;
       margin-bottom: 2px;
    }`
  ],
  templateUrl: './preview.publication.component.html',
  providers: [],
})
@ElementEnumAware
export class PreviewPublicationComponent  {
  @Input() element: any;
  @Input() elementKind: ElementKind;

  getElementKind(kind:ElementKind):string {
    console.log('Elementkind: ' + ElementKind[kind] + ' ' + kind);
    return ElementKind[kind];
  }

}
