import { Component, Input, AfterViewInit } from '@angular/core';
import { Concept, ElementKind, ElementRevisionRef, MessageService, PreviewService, getIcon, PUBLICATION_TYPES, getElementKind } from '../../../lib';

@Component({
  selector: 'qddt-preview-concept',
  templateUrl: 'preview.concept.component.html',
})

export class PreviewConceptComponent implements AfterViewInit {
  @Input() concept: Concept;

  public compId = Math.round(Math.random() * 10000);
  public readonly trackByIndex = (index: number, cqi) => cqi.id;

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

  public onClickTopic(id: string) {
    this.message.sendMessage({ elementId: id, elementKind: ElementKind[ElementKind.TOPIC_GROUP] });
  }

  public getMatIcon(cgi: ElementRevisionRef): string {
    return getIcon(cgi.elementKind);
  }

  public getLabelByElement(cgi: ElementRevisionRef): string {
    const kind = getElementKind(cgi.elementKind);
    return PUBLICATION_TYPES.find(e => e.id === kind).label;
  }

}
