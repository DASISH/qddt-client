import { Component, Output, EventEmitter } from '@angular/core';
import { ResponseDomainService } from './responsedomain.service';
import { DomainType, DomainTypeDescription } from './responsedomain.constant';

@Component({
  selector: 'responsedomain-search',
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
                     <autocomplete [items]="responseDomains" [searchField]="'name'"
                       [initialValue]="''" (autocompleteSelectEvent)="selectResponseDomain($event)">
                     </autocomplete>
                  </div>
               </div>
             </div>
  `
})

export class ResponseDomainSearchComponent {
  domainType: DomainType;
  @Output() selectResponseDomainEvent: EventEmitter<any> = new EventEmitter<any>();
  responseDomains: any[];
  domainTypeDescription: any[];

  constructor(private responseDomainService: ResponseDomainService) {
    this.responseDomains = [];
    this.domainTypeDescription = DomainTypeDescription;
    this.selectDomainType(DomainType.SCALE);
  }

  selectDomainType(id: DomainType) {
    this.domainType = id;
    let name = DomainTypeDescription.find((e: any) =>e.id === this.domainType).name;
    this.responseDomainService.getAll(name).subscribe((result: any) => {
    this.responseDomains = result.content;});
  }

  selectResponseDomain(suggestion: any) {
    this.selectResponseDomainEvent.emit(suggestion);
  }

  searchResponseDomains(key: string) {
    let name = DomainTypeDescription.find((e: any) =>e.id === this.domainType).name;
    this.responseDomainService.getAll(name, key).subscribe((result: any) => {
      this.responseDomains = result.content;
    });
  }
}
