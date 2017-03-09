import { Component, Input } from '@angular/core';
import { PublicationStatus, PublicationService, ElementTypes } from './publication.service';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'qddt-publication-preview',
  moduleId: module.id,
  templateUrl: './publication.preview.component.html',
  providers: [PublicationService],
})

export class PublicationPreviewComponent {
  @Input() element: any;
  @Input() elementType: any;

  constructor(private service: PublicationService) {
  }

}
