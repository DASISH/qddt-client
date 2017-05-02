import { Component, Input, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { PublicationStatus, PublicationService, ElementTypes } from './publication.service';
import { Subject } from 'rxjs/Subject';
let fileSaver = require('../controlconstruct/filesaver');

@Component({
  selector: 'qddt-publication-preview',
  moduleId: module.id,
  styles: [
    `:host /deep/ .row {
       margin-left: auto;
       margin-right: auto;
    }`
  ],
  templateUrl: './publication.preview.component.html',
  providers: [PublicationService],
})

export class PublicationPreviewComponent implements OnChanges {
  @Input() element: any;
  @Input() elementType: any;
  actions = new EventEmitter<string>();
  children: any[];

  constructor(private service: PublicationService) {
  }

  ngOnChanges(changes: SimpleChanges) {
    if(this.elementType === 1
      && changes['element'] !== null
      && changes['element'] !== undefined) {
      this.children = [];
      this.service.getByTopic(this.element.id)
        .subscribe((result: any) => {
        this.children = result.content || [];
      }, (error: any) => {
        console.log(error);
      });
    }
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
