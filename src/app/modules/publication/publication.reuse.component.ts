import { Component, EventEmitter, Output, Input } from '@angular/core';
import {ElementKind, ElementRevisionRef,  PUBLICATION_TYPES } from '../../lib';

@Component({
  selector: 'qddt-publication-reuse',
  templateUrl: './publication.reuse.component.html',
})

export class PublicationReuseComponent  {
  @Input() showButton: boolean;
  @Output() selectedEvent = new EventEmitter<ElementRevisionRef>();

  public showAddElement = false;
  public selectedElementKind: ElementKind;
  public publicationTypes = PUBLICATION_TYPES;

  constructor() {
    this.selectedElementKind = ElementKind.TOPIC_GROUP;
  }

  public onSelectElementKind(kind: ElementKind) {
    this.selectedElementKind = kind;
  }

  public onRevisionSelect( element: ElementRevisionRef) {
    this.selectedEvent.emit(element);
    this.onToggleAddElement();
  }

  public onToggleAddElement() {
    this.showAddElement = !this.showAddElement;
  }

}


