import { Component, Input, AfterViewInit } from '@angular/core';
import {
  ElementKind, ElementRevisionRef, IOtherMaterial, MessageService,
  PreviewService, Topic, getIcon, PUBLICATION_TYPES, getElementKind
} from '../../../lib';
import * as FileSaver from 'file-saver';


@Component({
  selector: 'qddt-preview-topic',

  styles: [
  ],
  templateUrl: 'preview.topic.component.html'
})

export class PreviewTopicComponent implements AfterViewInit {
  @Input() topic: Topic;

  constructor(private message: MessageService, private service: PreviewService) { }


  public ngAfterViewInit(): void {
    document.querySelectorAll('.collapsible').forEach(item => M.Collapsible.init(item));
  }

  public onViewDetail(element: ElementRevisionRef) {
    if (!element.element) {
      this.service.getRevisionByKind(element.elementKind, element.elementId, element.elementRevision).then(
        (result) => { element.element = result.entity; },
        (error) => { throw error; });
    }
  }

  public onClickStudy(id: string) {
    this.message.sendMessage({ elementId: id, elementKind: ElementKind[ElementKind.STUDY] });
  }

  public onDownloadFile(o: IOtherMaterial) {
    const fileName = o.originalName;
    this.service.getFile(o).then(
      (data: any) => {
        FileSaver.saveAs(data, fileName);
      });
  }

  public getMatIcon(cgi: ElementRevisionRef): string {
    return getIcon(cgi.elementKind);
  }

  public getLabelByElement(cgi: ElementRevisionRef): string {
    const kind = getElementKind(cgi.elementKind);
    return PUBLICATION_TYPES.find(e => e.id === kind).label;
  }

}
