
import {filter, distinctUntilChanged, debounceTime} from 'rxjs/operators';
import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { MaterializeAction } from 'angular2-materialize';
import { Subject } from 'rxjs';
import { TemplateService } from '../../template/template.service';
import { IPageResult, IPageSearch, IElement } from '../../shared/classes/interfaces';
import { ResponseDomain, DomainKind, DOMAIN_TYPE_DESCRIPTION } from '../../responsedomain/responsedomain.classes';
import { ElementRevisionRef, Page } from '../../shared/classes/classes';
import { ElementKind } from '../../shared/classes/enums';

@Component({
  selector: 'qddt-responsedomain-reuse',
  moduleId: module.id,
  templateUrl: './responsedomain.reuse.component.html',
})

export class ResponsedomainReuseComponent implements OnChanges  {
  @Input() readOnly: boolean;
  @Input() showbutton: boolean;
  @Input() responseDomain: ResponseDomain;
  @Output() selectedEvent = new EventEmitter<ElementRevisionRef>();
  @Output() removeEvent = new EventEmitter<any>();

  public modalActions = new EventEmitter<MaterializeAction>();

  public readonly RESPONSE_KIND = ElementKind.RESPONSEDOMAIN;
  public readonly domainTypeDescription: any[];

  public selectedDomainKind = DomainKind.SCALE;
  public responseDomainList = [];
  public revisionList: any[];
  public formId = Math.round( Math.random() * 10000);

  private searchKeysListener = new Subject<string>();
  private pageSearch: IPageSearch;

  constructor(private responseDomainService: TemplateService) {
    this.domainTypeDescription = DOMAIN_TYPE_DESCRIPTION.filter((e) => e.id > DomainKind.NONE && e.id < DomainKind.MISSING);
    this.pageSearch = { kind: this.RESPONSE_KIND, page: new Page(), key: '*' };
    this.searchKeysListener.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      filter(val => val.length > 0),)
      .subscribe((search: string) => {
        this.loadPage(search);
      });
  }

  searchResponseDomains(key: string) {
    this.searchKeysListener.next(key);
  }

  selectDomainType(id: DomainKind) {
    this.selectedDomainKind = id;
    this.loadPage('*');
  }

  ngOnChanges() {
    if (this.responseDomain) {
      this.selectedDomainKind = DomainKind[this.responseDomain.responseKind];
    } else if (!this.selectedDomainKind) {
      this.selectedDomainKind = DomainKind.SCALE;
    }
  }

  onResponseDomainSelected(element: IElement) {
    this.responseDomainService.getRevisionsByKind(this.RESPONSE_KIND , element.element.id).then(
      (result) => { this.revisionList = result.content; },
      (error) => { throw error; });
  }

  onRevisionSelected(item: ElementRevisionRef) {
    this.selectedEvent.emit(item);
    this.closeModal();
  }


  removeResponseDomain() {
    this.responseDomain = null;
    this.removeEvent.emit(true);
  }


  public openModal() {
    this.loadPage('*');
    this.modalActions.emit({action: 'modal', params: ['open']});
  }

  public closeModal() {
    this.modalActions.emit({action: 'modal', params: ['close']});
  }

  private loadPage(search: string): any {
    this.pageSearch.key = search;
    this.pageSearch.keys = new Map( [ ['ResponseKind',  DomainKind[this.selectedDomainKind] ] ] );
    this.responseDomainService.searchByKind(this.pageSearch).then(
      (result) => { this.responseDomainList = result.content; });
  }

}
