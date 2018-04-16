import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { MaterializeAction } from 'angular2-materialize';
import { DomainKind, DOMAIN_TYPE_DESCRIPTION, ResponseDomain } from './responsedomain.classes';
import { ResponseDomainService } from './responsedomain.service';
import { Subject } from 'rxjs/Subject';
import { ElementRevisionRef, Page } from '../shared/classes/classes';
import { ElementKind } from '../shared/classes/enums';
import { IElement } from '../shared/classes/interfaces';

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

  constructor(private responseDomainService: ResponseDomainService) {
    this.domainTypeDescription = DOMAIN_TYPE_DESCRIPTION.filter((e: any) => e.id !== DomainKind.MIXED);

    this.searchKeysListener
      .debounceTime(300)
      .distinctUntilChanged()
      .filter(val => val.length > 0)
      .subscribe((search: string) => {
        this.responseDomainService.getAll(DomainKind[this.selectedDomainKind], search, new Page( {size: 15} )).then(
          (result) => { this.responseDomainList = result.content; });
      });
  }

  searchResponseDomains(key: string) {
    this.searchKeysListener.next(key);
  }

  selectDomainType(id: DomainKind) {
    this.selectedDomainKind = id;
    this.responseDomain = null;
  }

  ngOnChanges() {
    if (this.responseDomain) {
      this.selectedDomainKind = DomainKind[this.responseDomain.responseKind];
    } else {
      this.selectedDomainKind = DomainKind.SCALE;
    }
  }

  onResponseDomainSelected(element: IElement) {
    this.responseDomainService.getResponseDomainsRevisions(element.element.id).then(
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
    this.searchKeysListener.next('*');
    this.modalActions.emit({action: 'modal', params: ['open']});
  }

  public closeModal() {
    this.modalActions.emit({action: 'modal', params: ['close']});
  }

}
