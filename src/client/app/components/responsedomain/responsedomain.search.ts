import { Component, Output, EventEmitter } from '@angular/core';
import { ResponseDomainService } from './responsedomain.service';
import { DomainType, DomainTypeDescription } from './responsedomain.constant';
import { Subject } from 'rxjs/Subject';

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
  private searchKeysSubect: Subject<string> = new Subject<string>();

  constructor(private responseDomainService: ResponseDomainService) {
    this.responseDomains = [];
    this.domainTypeDescription = DomainTypeDescription.filter((e:any) => e.id !== DomainType.MIXED);
    this.selectDomainType(DomainType.SCALE);
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
    this.searchKeysSubect.next(key);
  }
}
