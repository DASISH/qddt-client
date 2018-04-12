import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { DomainKind, DOMAIN_TYPE_DESCRIPTION } from './responsedomain.constant';
import { ResponseDomainService } from './responsedomain.service';
import { Subject } from 'rxjs/Subject';
import { MaterializeAction } from 'angular2-materialize';
import { Page } from '../shared/classes/classes';
import {QDDT_QUERY_INFOES} from '../shared/classes/constants';
import {ElementKind} from '../shared/classes/enums';

@Component({
  selector: 'qddt-responsedomain-reuse',
  moduleId: module.id,
  templateUrl: './responsedomain.reuse.component.html',
})

export class ResponsedomainReuseComponent implements OnChanges  {
  @Input() readOnly: boolean;
  @Input() showbutton: boolean;
  @Input() responseDomain: any;
  @Input() modalId: any;
  @Output() dismissEvent = new EventEmitter<any>();
  @Output() selectedEvent = new EventEmitter<any>();
  @Output() removeEvent = new EventEmitter<any>();

  public readonly RESPONSE_KIND = QDDT_QUERY_INFOES[ElementKind.RESPONSEDOMAIN];
  public selectedResponseDomain: any;
  public selectedRevision: number;
  public domainKindInstance = DomainKind;
  public domainTypeDescription: any[];
  public modalRdActions = new EventEmitter<MaterializeAction>();
  public showAutocomplete: boolean;

  private selectedDomainKind: DomainKind;
  private selectedIndex: number;
  private responseDomainList = [];
  private searchKeysListener = new Subject<string>();

  constructor(private responseDomainService: ResponseDomainService) {
    this.showAutocomplete = false;
    this.selectedDomainKind = DomainKind.SCALE;
    this.domainTypeDescription = DOMAIN_TYPE_DESCRIPTION.filter((e: any) => e.id !== DomainKind.MIXED);
    this.selectedIndex = 0;
    this.searchKeysListener
      .debounceTime(300)
      .distinctUntilChanged()
      .filter(val => val.length > 0)
      .subscribe((name: string) => {
        const domainType = DOMAIN_TYPE_DESCRIPTION.find((e: any) => e.id === this.selectedDomainKind).name;
        this.responseDomainService.getAll(domainType, name, new Page( {size: 15} )).then(
          (result) => {
            this.responseDomainList = result.content;
          });
      });
     this.reuse();
  }


  ngOnChanges() {
    // console.debug('ngOnChanges');
    if (this.responseDomain) {
      const description = this.domainTypeDescription.find((e: any) => e.name === this.responseDomain.responseKind);
      if (description !== undefined) {
        this.selectedDomainKind = description.id;
      }
    } else {
      this.selectedDomainKind = DomainKind.SCALE;
    }
  }
  removeResponseDomain() {
    // console.log('responsDomainRemove.emit');
    this.responseDomain = null;
    this.removeEvent.emit(true);
  }

  onDismissRDReuse() {
    this.closeModalRDReuse();
      // this.dismissEvent.emit(true);
  }

  openModalRDReuse() {
    this.searchKeysListener.next('*');
    this.modalRdActions.emit({action: 'modal', params: ['open']});
  }

  closeModalRDReuse() {
    this.modalRdActions.emit({action: 'modal', params: ['close']});
  }

  formSave() {
    // console.debug('formChange');
    if (this.responseDomain.id) {
      this.responseDomainService.update(this.responseDomain)
        .subscribe((result: any) => {
          this.responseDomain = result;
          const object = {
            responseDomain: this.responseDomain
          };
          this.selectedEvent.emit(object);
      });
    } else {
      this.responseDomainService.create(this.responseDomain).subscribe((result: any) => {
        this.responseDomain = result;
        this.responseDomainList.push(this.responseDomain);
        const object = {
          responseDomain: this.responseDomain
        };
        this.selectedEvent.emit(object);
      });
    }
    // this.isVisible = false;
  }

  selectDomainType(id: DomainKind) {
    this.selectedDomainKind = id;
    this.selectedResponseDomain = null;
    this.reuse();
    this.responseDomain = null;
  }

  reuse() {
    // console.debug('reuse');
    this.responseDomainService.getAll(DomainKind[this.selectedDomainKind], '', new Page({size: 20})).then(
      (result: any) => {
        this.responseDomainList = result.content;
        this.showAutocomplete = true; }
      );
  }

  onResponseDomainSelected(responseDomain: any) {
    this.selectedResponseDomain = responseDomain;
    this.selectedRevision = 0;
  }

  onUseResponseDomainEvent(item) {
    this.selectedEvent.emit(item);
    this.closeModalRDReuse();
    // this.isVisible = false;
  }

  searchResponseDomains(key: string) {
    this.searchKeysListener.next(key);
  }

}
