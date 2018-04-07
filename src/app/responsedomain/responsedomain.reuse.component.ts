import { Component, Input, Output, EventEmitter, OnChanges, OnInit, AfterViewInit } from '@angular/core';
import { DomainKind, DomainTypeDescription } from './responsedomain.constant';
import { ResponseDomainService } from './responsedomain.service';
import { Subject } from 'rxjs/Subject';
import { MaterializeAction } from 'angular2-materialize';
import { QDDT_ELEMENTS, ElementKind } from '../shared/elementinterfaces/elements';
import { Page } from '../shared/table/table.page';

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

  public selectedResponseDomain: any;
  public selectedRevision: number;
  public domainTypeDef = DomainKind;
  public domainTypeDescription: any[];
  public modalRdActions = new EventEmitter<MaterializeAction>();
  public showAutocomplete: boolean;

  private domainType: DomainKind;
  private responseDomains: any;
  private selectedIndex: number;
  private searchKeysSubject: Subject<string> = new Subject<string>();
  private readonly RESPONSEKIND = QDDT_ELEMENTS[ElementKind.RESPONSEDOMAIN];

  constructor(private responseDomainService: ResponseDomainService) {
    this.showAutocomplete = false;
    this.domainType = DomainKind.SCALE;
    this.responseDomains = [];
    this.domainTypeDescription = DomainTypeDescription.filter((e: any) => e.id !== DomainKind.MIXED);
    this.selectedIndex = 0;
    this.searchKeysSubject
      .debounceTime(300)
      .distinctUntilChanged()
      .filter(val => val.length > 0)
      .subscribe((name: string) => {
        const domainType = DomainTypeDescription.find((e: any) => e.id === this.domainType).name;
        this.responseDomainService.getAll(domainType, name, new Page( {size: 15} )).then(
          (result) => {
            this.responseDomains = result.content;
          });
      });
     this.reuse();
  }


  ngOnChanges() {
    // console.debug('ngOnChanges');
    if (this.responseDomain) {
      const description = this.domainTypeDescription.find((e: any) => e.name === this.responseDomain.responseKind);
      if (description !== undefined) {
        this.domainType = description.id;
      }
    } else {
      this.domainType = DomainKind.SCALE;
    }
  }
  removeResponseDomain() {
    // console.log('responsDomainRemove.emit');
    this.responseDomain = null;
    this.removeEvent.emit(true);
  }

  onDismissRDReuse() {
    this.dismissEvent.emit(true);
  }

  openModalRDReuse() {
    this.searchKeysSubject.next('*');
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
        this.responseDomains.push(this.responseDomain);
        const object = {
          responseDomain: this.responseDomain
        };
        this.selectedEvent.emit(object);
      });
    }
    // this.isVisible = false;
  }

  selectDomainType(id: DomainKind) {
    this.domainType = id;
    this.selectedResponseDomain = null;
    this.reuse();
    this.responseDomain = null;
  }

  reuse() {
    // console.debug('reuse');
    this.responseDomainService.getAll(DomainKind[this.domainType], '', new Page({size: 20})).then(
      (result: any) => {
        this.responseDomains = result.content;
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
    this.searchKeysSubject.next(key);
  }

}
