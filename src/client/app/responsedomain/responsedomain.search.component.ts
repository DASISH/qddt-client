import { Component, Output, EventEmitter } from '@angular/core';
import { ResponseDomainService } from './responsedomain.service';
import {  DomainTypeDescription, DomainKind } from './responsedomain.constant';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'qddt-responsedomain-search',
  providers: [ResponseDomainService],
  styles: [ ],
  template: `
<div class="row card">
  <div class="row">
     <div class="row"><span>Select a Response Domain</span></div>
     <div class="row"><div class="col left" *ngFor="let domain of domainTypeDescription">
            <input name="domaintypegroup" type="radio"
            id="domain-type-{{domain.id}}" (click)="selectDomainType(domain.id)"
            [checked]="domainType === domain.id" /> <label
            [attr.for]="'domain-type-' + domain.id">{{domain.label}}</label>
      </div></div>
      <div class="row">
         <autocomplete
           [items]="responseDomains"
           [elementtype]="ResponseKind"
           (autocompleteSelectEvent)="selectResponseDomain($event)">
         </autocomplete>
      </div>
   </div>
 </div>
  `
})

export class ResponseDomainSearchComponent {
  domainType: DomainKind;
  @Output() selectResponseDomainEvent: EventEmitter<any> = new EventEmitter<any>();
  responseDomains: any[];
  domainTypeDescription: any[];
  private searchKeysSubect: Subject<string> = new Subject<string>();

  constructor(private responseDomainService: ResponseDomainService) {
    this.responseDomains = [];
    this.domainTypeDescription = DomainTypeDescription.filter((e:any) => e.id !== DomainKind.MIXED);
    this.selectDomainType(DomainKind.SCALE);
    this.searchKeysSubect
      .debounceTime(300)
      .distinctUntilChanged()
      .subscribe((name: string) => {
        this.responseDomainService
          .getAll(DomainKind[this.domainType], name).subscribe((result: any) => {
            this.responseDomains = result.content;
          });
      });
  }

  selectDomainType(id: DomainKind) {
    this.domainType = id;
    this.responseDomainService.getAll(DomainKind[id]).subscribe((result: any) => {
    this.responseDomains = result.content;});
  }

  selectResponseDomain(suggestion: any) {
    this.selectResponseDomainEvent.emit(suggestion);
  }

  searchResponseDomains(key: string) {
    this.searchKeysSubect.next(key);
  }
}
