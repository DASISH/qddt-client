import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { PublicationService } from './publication.service';
import { Subject } from 'rxjs/Subject';
import { ElementRevisionRef, ElementKind, QddtElement, QDDT_ELEMENTS } from '../shared/elementinterfaces/elements';
import { IEntityAudit } from '../shared/elementinterfaces/entityaudit';

@Component({
  selector: 'qddt-publication-reuse',
  moduleId: module.id,
  templateUrl: './publication.reuse.component.html',
  styles: [
    `label, [type="radio"] + label { padding-left: 25px; }`,
    ':host /deep/ .hoverable .row { min-height:3rem; margin-bottom:0px;}'
  ],
})

export class PublicationReuseComponent  {
  @Input() showbutton: boolean;
  @Output() selectedEvent = new EventEmitter<ElementRevisionRef>();

  public showAddElement = false;
  public selectedElementKind: ElementKind;
  public revisions: any[];
  public elements: any[];
  public showProgressBar = false;

  queryFields: QddtElement[] = [
    QDDT_ELEMENTS[ElementKind.TOPIC_GROUP],
    QDDT_ELEMENTS[ElementKind.CONCEPT],
    QDDT_ELEMENTS[ElementKind.QUESTION_ITEM],
    QDDT_ELEMENTS[ElementKind.QUESTION_CONSTRUCT],
    QDDT_ELEMENTS[ElementKind.SEQUENCE_CONSTRUCT]
  ];

  private searchKeysListener: Subject<string> = new Subject<string>();

  constructor(private service: PublicationService) {
    this.selectedElementKind = ElementKind.TOPIC_GROUP;
    this.elements = [];
    this.searchKeysListener
      .debounceTime(300)
      .distinctUntilChanged()
      .subscribe((name: string) => {
        this.service.searchElements(this.selectedElementKind, name)
          .then((result: any) => {
            this.elements = result.content;
          });
      });
  }

  public onSelectElement(item ) {
    this.revisions = null;
    this.showProgressBar = true;
    this.service.getRevisionsByKind( this.selectedElementKind, item.id).then(
      (result) => {
        this.revisions = result.content;
        this.showProgressBar = false;
      },
      (error) => { this.showProgressBar = false; throw error; }
    );
  }

  public onRevisionSelected( element: ElementRevisionRef) {
    console.log(element);
    this.selectedEvent.emit(element);
    this.onToggleAddElement();
  }

  public onRevisionDismiss(value) {
    this.revisions = null;
    this.elements = null;
  }

  onSelectElementKind(kind: ElementKind) {
    this.selectedElementKind = kind;
    this.elements = null;
    this.revisions = null;
  }

  onSearchElements(key: string) {
    this.searchKeysListener.next(key);
  }

  onToggleAddElement() {
    this.showAddElement = !this.showAddElement;
    if (!this.showAddElement) {
      this.elements = null;
      this.revisions = null;
    }
  }


  private getElementType(kind: ElementKind): QddtElement {
     return this.queryFields.find(e => e.id === kind);
  }

}
