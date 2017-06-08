import { Component, Input, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { PublicationService } from './publication.service';
import { MaterializeAction } from 'angular2-materialize';

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
