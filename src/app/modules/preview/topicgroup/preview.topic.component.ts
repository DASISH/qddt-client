import { Component, Input } from '@angular/core';
import {ElementKind, IOtherMaterial, MessageService, PreviewService, Topic} from '../../../lib';

import filesaver from 'file-saver';

@Component({
  selector: 'qddt-preview-topic',

  styles: [
  ],
  templateUrl: 'preview.topic.component.html'
})

export class PreviewTopicComponent {
  @Input() topic: Topic;

  constructor(private service: PreviewService, private  message: MessageService) {
  }

  onClickStudy(id: string) {
    this.message.sendMessage( { elementId: id, elementKind: ElementKind[ElementKind.STUDY]} );
  }

  onDownloadFile(o: IOtherMaterial) {
    const fileName = o.originalName;
    this.service.getFile(o).then(
      (data: any) => {
        filesaver.saveAs(data, fileName);
      });
  }
}
