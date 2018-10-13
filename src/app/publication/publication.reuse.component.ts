
import {distinctUntilChanged, debounceTime} from 'rxjs/operators';
import { Component, EventEmitter, Output, Input } from '@angular/core';
import { Subject } from 'rxjs';
import { TemplateService} from '../template/template.service';
import { ElementKind, ElementRevisionRef, IElement, IPageSearch, IRevisionRef, Page } from '../shared/classes';
import { PUBLICATION_TYPES} from './publication.classes';

@Component({
  selector: 'qddt-publication-reuse',
  moduleId: module.id,
  templateUrl: './publication.reuse.component.html',
  styles: [
    `label, [type="radio"] + label { padding-left: 25px; }`,
    ':host /deep/ .hoverable .row { min-height:3rem; margin-bottom:0;}'
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
  public publicationTypes = PUBLICATION_TYPES;


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

  public onDismiss() {
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


