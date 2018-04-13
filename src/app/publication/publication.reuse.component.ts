import { Component, EventEmitter, Output, Input } from '@angular/core';
import { PublicationService } from './publication.service';
import { Subject } from 'rxjs/Subject';
import { ElementRevisionRef, QueryInfo } from '../shared/classes/classes';
import { ElementKind } from '../shared/classes/enums';
import { QDDT_QUERY_INFOES } from '../shared/classes/constants';

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

  queryFields: QueryInfo[] = [
    QDDT_QUERY_INFOES[ElementKind.TOPIC_GROUP],
    QDDT_QUERY_INFOES[ElementKind.CONCEPT],
    QDDT_QUERY_INFOES[ElementKind.QUESTION_ITEM],
    QDDT_QUERY_INFOES[ElementKind.QUESTION_CONSTRUCT],
    QDDT_QUERY_INFOES[ElementKind.SEQUENCE_CONSTRUCT]
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

}
