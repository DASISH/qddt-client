import { Component, Input } from '@angular/core';

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
  templateUrl: './preview.component.html',
  providers: [],
})

export class PreviewComponent  {
  @Input() element: any;
  @Input() elementType: String;

  constructor() {
    console.info('elementType ' + this.elementType);
  }
}
