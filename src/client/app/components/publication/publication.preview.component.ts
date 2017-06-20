import { Component, Input } from '@angular/core';
import { PublicationService } from './publication.service';

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
  templateUrl: './publication.preview.component.html',
  providers: [PublicationService],
})

export class PublicationPreviewComponent  {
  @Input() element: any;
  @Input() elementType: any;

}
