import { Component, Output, EventEmitter} from 'angular2/core';
import {LocalDatePipe} from '../../common/date_pipe';
import {MaterializeDirective} from 'angular2-materialize/dist/materialize-directive';
import {AutocompleteComponent} from '../autocomplete/autocomplete.component';
import {ResponseDomainService} from './responsedomain.service';
import {DomainType, DomainTypeDescription} from './responsedomain.constant';

@Component({
  selector: 'responsedomain-search',
  providers: [ResponseDomainService],
  directives: [MaterializeDirective, AutocompleteComponent],
  pipes: [LocalDatePipe],
  styles: [ ],
  template: `
           <div class="row card">
              <div class="row">
                 <div class="row"><span>Select a Response Domain</span></div>
                 <div class="row"><div class="col left" *ngFor="#domain of domainTypeDescription">
                        <input name="domaintypegroup" type="radio"
                        id="domain-type-{{domain.id}}" (click)="selectDomainType(domain.id)"
                        [checked]="domainType === domain.id" /> <label
                        [attr.for]="'domain-type-' + domain.id">{{domain.label}}</label>
                  </div></div>
                  <div class="row">
                     <autocomplete [items]="responseDomains" [searchField]="'name'"
                       (autocompleteFocusEvent)="showAutoComplete = true;"
                       [initialValue]="''" (autocompleteSelectEvent)="selectResponseDomain($event)">
                     </autocomplete>
                  </div>
               </div>
             </div>
  `
})

export class ResponseDomainSearchComponent {
  domainType: DomainType;
  @Output() selectResponseDomainEvent: EventEmitter<any> = new EventEmitter();
  private responseDomains: any[];
  private domainTypeDescription: any[];

  constructor(private responseDomainService: ResponseDomainService) {
    this.responseDomains = [];
    this.domainTypeDescription = DomainTypeDescription;
    this.selectDomainType(DomainType.SCALE);
  }

  selectDomainType(id: DomainType) {
    this.domainType = id;
    let name = DomainTypeDescription.find(e=>e.id === this.domainType).name;
    this.responseDomainService.getAll(name).subscribe(result => {
    this.responseDomains = result.content;});
  }

  selectResponseDomain(suggestion: any) {
    this.selectResponseDomainEvent.emit(suggestion);
  }

  searchResponseDomains(key: string) {
    let name = DomainTypeDescription.find(e=>e.id === this.domainType).name;
    this.responseDomainService.getAll(name, key).subscribe(result => {
      this.responseDomains = result.content;
    });
  }
}
