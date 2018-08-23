
import {distinctUntilChanged, debounceTime} from 'rxjs/operators';
import { Component, EventEmitter, Output, Input } from '@angular/core';
import { PublicationService } from './publication.service';
import { Subject } from 'rxjs';
import {ElementRevisionRef, Page, QueryInfo} from '../shared/classes/classes';
import { ElementKind } from '../shared/classes/enums';
import { QDDT_QUERY_INFOES } from '../shared/classes/constants';
import {IElement, IPageSearch, IRevisionRef} from '../shared/classes/interfaces';
import {TemplateService} from '../template/template.service';

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
  public revisionList: any[];
  public itemList: any[];
  public showProgressBar = false;

  queryFields: QueryInfo[] = [
    QDDT_QUERY_INFOES[ElementKind.TOPIC_GROUP],
    QDDT_QUERY_INFOES[ElementKind.CONCEPT],
    QDDT_QUERY_INFOES[ElementKind.QUESTION_ITEM],
    QDDT_QUERY_INFOES[ElementKind.QUESTION_CONSTRUCT],
    QDDT_QUERY_INFOES[ElementKind.SEQUENCE_CONSTRUCT]
  ];

  private searchKeysListener: Subject<string> = new Subject<string>();
  private pageSearch: IPageSearch = { kind: ElementKind.TOPIC_GROUP, key: '*', page: new Page(), sort: 'name,asc' };

  constructor(private templateService: TemplateService) {
    this.selectedElementKind = ElementKind.TOPIC_GROUP;
    this.searchKeysListener.pipe(
      debounceTime(300),
      distinctUntilChanged())
      .subscribe((name: string) => this.loadPage(name));
  }

  public onSelectElementKind(kind: ElementKind) {
    this.pageSearch.kind = kind;
    this.selectedElementKind = kind;
    this.loadPage('*');
  }

  public onItemSearch(key: IElement) {
    this.searchKeysListener.next(key.element);
  }

  public onRevisionSearch(item: IRevisionRef ) {
    this.revisionList = null;
    this.showProgressBar = true;
    this.templateService.getRevisionsByKind( this.selectedElementKind, item.elementId).then(
      (result) => {
        this.revisionList = result.content;
        this.showProgressBar = false;
      },
      (error) => { this.showProgressBar = false; throw error; }
    );
  }

  public onRevisionSelect( element: ElementRevisionRef) {
    this.selectedEvent.emit(element);
    this.onToggleAddElement();
  }

  public onDismiss(value) {
    this.revisionList = null;
    this.itemList = null;
  }

  public onToggleAddElement() {
    this.showAddElement = !this.showAddElement;
    if (!this.showAddElement) {
      this.loadPage('*');
    }
  }

  private loadPage(search: string) {
    this.pageSearch.key = search;
    this.templateService.searchByKind(this.pageSearch)
      .then((result ) => {
        this.itemList = result.content;
        this.revisionList = null;
      });

  }
}


