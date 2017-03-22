import { Component, Input, EventEmitter } from '@angular/core';
import { PublicationStatus, PublicationService, ElementTypes } from './publication.service';
import { Subject } from 'rxjs/Subject';
let fileSaver = require('../controlconstruct/filesaver');

@Component({
  selector: 'qddt-publication-preview',
  moduleId: module.id,
  templateUrl: './publication.preview.component.html',
  providers: [PublicationService],
})

export class PublicationPreviewComponent {
  @Input() element: any;
  @Input() elementType: any;
  actions = new EventEmitter<string>();

  constructor(private service: PublicationService) {
  }

  onDownloadFile(o: any) {
    let fileType = o.fileType || 'text/plain';
    let fileName = o.originalName;
    let len = o.size;
    this.service.getFile(o.id).subscribe(
      (data: any) => {
        fileSaver(data, fileName);
      },
      error => console.log(error));
  }

  onQuestionitemDetail(e: any) {
    this.actions.emit('openModal');
  }

}
