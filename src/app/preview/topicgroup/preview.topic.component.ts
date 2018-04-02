import { Component, Input } from '@angular/core';
import { PreviewService } from '../preview.service';
import { Topic } from '../../home/home.service';

const filesaver = require('file-saver');

@Component({
  selector: 'qddt-preview-topic',
  moduleId: module.id,
  styles: [
    'ul .collapsible { margin:20px; padding:5px; !important;}',
    'collapsible-header { display: flow-root; margin-bottom: 0px;}'
  ],
  templateUrl: 'preview.topic.component.html'
})

export class PreviewTopicComponent {
  @Input() topic: Topic;

  constructor(private service: PreviewService) {
  }

  onDownloadFile(o: any) {
    const fileName = o.originalName;
    this.service.getFile(o.id).then(
      (data: any) => {
        filesaver.saveAs(data, fileName);
      });
  }
}
