import { Component, Input, AfterViewInit } from '@angular/core';
import {Concept, ElementKind, ElementRevisionRef, MessageService, PreviewService} from '../../../lib';

@Component({
  selector: 'qddt-preview-concept',
  templateUrl: 'preview.concept.component.html',
})

export class PreviewConceptComponent implements AfterViewInit {
  @Input() concept: Concept;

  constructor(private  message: MessageService, private service: PreviewService) { }

  ngAfterViewInit(): void {
    document.querySelectorAll('.collapsible').forEach( item => M.Collapsible.init(item));

  }

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

  onClickTopic(id: string) {
    this.message.sendMessage( { elementId: id, elementKind: ElementKind[ElementKind.TOPIC_GROUP]} );
  }


}
