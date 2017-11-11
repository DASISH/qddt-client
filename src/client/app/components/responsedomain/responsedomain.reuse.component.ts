import { Component, Input, Output, EventEmitter, OnChanges, OnInit, AfterViewInit } from '@angular/core';
import { DomainKind, DomainTypeDescription } from './responsedomain.constant';
import { ResponseDomain, ResponseDomainService } from './responsedomain.service';
import { Subject } from 'rxjs/Subject';
import { MaterializeAction } from 'angular2-materialize';
import { ElementKind, QddtElementType, QddtElementTypes } from '../../shared/preview/preview.service';
import { Category } from '../category/category.service';

@Component({
  selector: 'qddt-responsedomain-reuse',
  moduleId: module.id,
  templateUrl:'./responsedomain.reuse.component.html',
  styles: [],
  providers: [ResponseDomainService],
})

export class ResponsedomainReuseComponent implements OnChanges ,AfterViewInit{
  @Input() readOnly: boolean;
  @Input() showbutton: boolean;
  @Input() responseDomain: any;
  @Input() modalId: any;
  @Output() dismissEvent = new EventEmitter<any>();
  @Output() responseDomainSelected = new EventEmitter<any>();
  @Output() responseDomainRemove = new EventEmitter<any>();

  selectedResponseDomain: any;
  selectedRevision: number;
  public domainTypeDef = DomainKind;
  public domainTypeDescription: any[];
  private modalRdActions = new EventEmitter<MaterializeAction>();
  private domainType: DomainKind;
  private showAutocomplete: boolean;
  private responseDomains: any;
  private selectedIndex: number;
  private searchKeysSubject: Subject<string> = new Subject<string>();
  private readonly RESPONSEKIND: QddtElementType  = QddtElementTypes[ElementKind.RESPONSEDOMAIN];

  constructor(private responseDomainService: ResponseDomainService) {
    this.showAutocomplete = false;
    this.domainType = DomainKind.SCALE;
    this.responseDomains = [];
    this.domainTypeDescription = DomainTypeDescription.filter((e:any) => e.id !== DomainKind.MIXED);
    this.selectedIndex = 0;
    this.searchKeysSubject
      .debounceTime(300)
      .distinctUntilChanged()
      .filter(val => val.length > 0)
      .subscribe((name: string) => {
        let domainType = DomainTypeDescription.find((e: any) => e.id === this.domainType).name;
        this.responseDomainService
          .getAll(domainType, name).subscribe((result: any) => {
            this.responseDomains = result.content;
          });
      });
    // this.reuse();/
  }


  ngAfterViewInit() {
    this.searchKeysSubject.next('*');
  }
  ngOnChanges() {
    console.debug('ngOnChanges');
    if (this.responseDomain) {
      let description = this.domainTypeDescription.find((e: any) => e.name === this.responseDomain.responseKind);
      if (description !== undefined) {
        this.domainType = description.id;
      }
    } else {
      this.domainType = DomainKind.SCALE;
    }
  }
  removeResponseDomain() {
    console.log('responsDomainRemove.emit');
    this.responseDomain = null;
    this.responseDomainRemove.emit(true);
  }

  onDismissRDReuse() {
    this.dismissEvent.emit(true);
  }

  openModalRDReuse() {
    this.modalRdActions.emit({action:'modal',params:['open']});
  }

  closeModalRDReuse() {
    this.modalRdActions.emit({action:'modal',params:['close']});
  }

  formSave() {
    console.debug('formChange');
    if (this.responseDomain.id) {
      this.responseDomainService.update(this.responseDomain)
        .subscribe((result: any) => {
          this.responseDomain = result;
          let object = {
            responseDomain: this.responseDomain
          };
          this.responseDomainSelected.emit(object);
      });
    } else {
      this.responseDomainService.create(this.responseDomain).subscribe((result: any) => {
        this.responseDomain = result;
        this.responseDomains.push(this.responseDomain);
        let object = {
          responseDomain: this.responseDomain
        };
        this.responseDomainSelected.emit(object);
      });
    }
    // this.isVisible = false;
  }

  selectDomainType(id: DomainKind) {
    this.domainType = id;
    this.selectedResponseDomain = null;
    // this.reuse();
    this.responseDomain = null;
  }

  // reuse() {
  //   console.debug('reuse');
  //   this.responseDomainService.getAll(DomainKind[this.domainType]).subscribe((result: any) => {
  //     this.responseDomains = result.content;
  //     this.showAutocomplete = true;
  //   });
  // }

  onResponseDomainSelected(responseDomain: any) {
    this.selectedResponseDomain = responseDomain;
    this.selectedRevision = 0;
  }

  onUseResponseDomainEvent(item) {
    this.responseDomainSelected.emit(item);
    this.closeModalRDReuse();
    // this.isVisible = false;
  }

  searchResponseDomains(key: string) {
    this.searchKeysSubject.next(key);
  }

}
