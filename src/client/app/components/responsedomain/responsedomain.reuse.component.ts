import { Component, Input, Output, EventEmitter, OnChanges, OnInit } from '@angular/core';
import { DomainType, DomainTypeDescription } from './responsedomain.constant';
import { ResponseDomain, ResponseDomainService } from './responsedomain.service';
import { Subject } from 'rxjs/Subject';
import { MaterializeAction } from 'angular2-materialize';

@Component({
  selector: 'qddt-responsedomain-reuse',
  moduleId: module.id,
  templateUrl:'./responsedomain.reuse.component.html',
  styles: [],
  providers: [ResponseDomainService],
})

export class ResponsedomainReuseComponent implements OnInit, OnChanges {
  @Input() isVisible: boolean;
  @Input() responseDomain: any;
  @Input() name: String;
  @Output() responseDomainReuse = new EventEmitter<any>();
  // @Output() dismissEvent = new EventEmitter<any>();
  selectedResponseDomain: any;
  selectedRevision: number;
  public domainTypeDef = DomainType;
  public domainTypeDescription: any[];
  private modalRdActions = new EventEmitter<MaterializeAction>();
  private domainType: DomainType;
  private showAutocomplete: boolean;
  private responseDomains: any;
  private selectedIndex: number;
  private searchKeysSubect: Subject<string> = new Subject<string>();

  constructor(private responseDomainService: ResponseDomainService) {
    console.debug('responsedomain reuse...');
    this.showAutocomplete = false;
    this.domainType = DomainType.SCALE;
    this.responseDomains = [];
    this.domainTypeDescription = DomainTypeDescription.filter((e:any) => e.id !== DomainType.MIXED);
    this.selectedIndex = 0;
    this.searchKeysSubect
      .debounceTime(300)
      .distinctUntilChanged()
      .subscribe((name: string) => {
        let domainType = DomainTypeDescription.find((e: any) => e.id === this.domainType).name;
        this.responseDomainService
          .getAll(domainType, name).subscribe((result: any) => {
            this.responseDomains = result.content;
          });
      });
    this.reuse();
    console.debug('responsedomain reuse cnst done...');
  }

  ngOnInit() {
    this.searchKeysSubect.next('');
  }

  ngOnChanges() {
    console.debug('ngOnChanges');
    if (this.responseDomain !== undefined && this.responseDomain !== null) {
      let description = this.domainTypeDescription.find((e: any) => e.name === this.responseDomain.responseKind);
      if (description !== undefined) {
        this.domainType = description.id;
      }
    } else {
      this.domainType = DomainType.SCALE;
    }
  }
  //
  // onDismiss() {
  //   this.dismissEvent.emit(true);
  // }

  formChange() {
    console.debug('formChange');
    if (this.responseDomain.id !== undefined && this.responseDomain.id !== '') {
      this.responseDomainService.update(this.responseDomain).subscribe((result: any) => {
        this.responseDomain = result;
        let object = {
          responseDomain: this.responseDomain
        };
        this.responseDomainReuse.emit(object);
      });
    } else {
      this.responseDomainService.create(this.responseDomain).subscribe((result: any) => {
        this.responseDomain = result;
        this.responseDomains.push(this.responseDomain);
        let object = {
          responseDomain: this.responseDomain
        };
        this.responseDomainReuse.emit(object);
      });
    }
    this.isVisible = false;
  }

  selectDomainType(id: DomainType) {
    this.domainType = id;
    this.selectedResponseDomain = null;
    this.reuse();
    this.responseDomain = null;
  }

  reuse() {
    console.debug('reuse');
    this.responseDomainService.getAll(DomainTypeDescription.find((e: any) =>
      e.id === this.domainType).name).subscribe((result: any) => {
      this.responseDomains = result.content;
      this.showAutocomplete = true;
    });
  }

  select(responseDomain: any) {
    this.selectedResponseDomain = responseDomain;
    this.selectedRevision = 0;
  }

  onUseResponseDomainEvent(item) {
    this.responseDomainReuse.emit(item);
    this.onCloseModal();
    // this.isVisible = false;
  }

  searchResponseDomains(key: string) {
    this.searchKeysSubect.next(key);
  }

  openSelectRevisionRDModal() {
    console.log('openSelectRevisionRDModal');
    this.modalRdActions.emit({action:'modal', params:['open']});
    // this.responseDomainService.getAll().subscribe(
    //   result => { this.responseDomains = result.content;
    //   }, (error: any) => console.log(error));
  }

  onCloseModal() {
    this.modalRdActions.emit({action:'modal', params:['close']});
  }
}
