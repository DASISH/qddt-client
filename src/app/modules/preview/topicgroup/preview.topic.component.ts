import { Component, Input } from '@angular/core';
import {ElementKind, ElementRevisionRef, IOtherMaterial, MessageService, PreviewService, Topic} from '../../../lib';
import * as FileSaver from 'file-saver';


@Component({
  selector: 'qddt-preview-topic',

  styles: [
  ],
  templateUrl: 'preview.topic.component.html'
})

export class PreviewTopicComponent {
  @Input() topic: Topic;

  constructor(private  message: MessageService, private service: PreviewService) { }

  onViewDetail(element: ElementRevisionRef) {
    if (!element.element) {
      this.service.getRevisionByKind(element.elementKind, element.elementId, element.elementRevision).then(
        (result) => { element.element = result.entity; },
        (error) => { throw error; });
    }
  }
  onClickStudy(id: string) {
    this.message.sendMessage( { elementId: id, elementKind: ElementKind[ElementKind.STUDY]} );
  }

  onDownloadFile(o: IOtherMaterial) {
    const fileName = o.originalName;
    this.service.getFile(o).then(
      (data: any) => {
        FileSaver.saveAs(data, fileName);
      });
  }
}
