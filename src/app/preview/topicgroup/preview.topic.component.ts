import { Component, Input } from '@angular/core';
import { PreviewService } from '../preview.service';
import { QddtMessageService } from '../../core/services/message.service';
import { Topic } from '../../home/home.classes';
import { ElementKind } from '../../shared/classes/enums';
import { IOtherMaterial } from '../../shared/classes/interfaces';

const filesaver = require('file-saver');

@Component({
  selector: 'qddt-preview-topic',

  styles: [
  ],
  templateUrl: 'preview.topic.component.html'
})

export class PreviewTopicComponent {
  @Input() topic: Topic;

  constructor(private service: PreviewService, private  message: QddtMessageService) {
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
