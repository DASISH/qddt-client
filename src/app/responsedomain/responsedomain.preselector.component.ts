import {Component, OnChanges, SimpleChanges} from '@angular/core';
import { DOMAIN_TYPE_DESCRIPTION, DomainKind } from './responsedomain.classes';
import { QddtMessageService } from '../core/global/message.service';
import { ActionKind, ElementKind } from '../shared/classes/enums';
import { IPageSearch } from '../shared/classes/interfaces';
import { QddtPropertyStoreService } from '../core/global/property.service';
import { Page } from '../shared/classes/classes';

@Component({
  selector: 'qddt-responsedomain-preselector',
  moduleId: module.id,
  template: `
  <div class="card-action">
    <div class="row">
    <div class="col left" *ngFor="let domain of domainTypeDescription" >
      <input name="domaintypegroup" type="radio" id="domain{{domain.id}}"
        (click)="onSelectDomainType(domain.id)" [checked]="domainType === domain.id"/>
      <label class="white-text" for="domain{{domain.id}}" >{{ domain.label }}</label>
    </div>
  </div>
</div>`
,
providers: []
})
export class ResponsePreSelector implements OnChanges {

  public domainType = DomainKind.SCALE;
  public domainTypeDescription = DOMAIN_TYPE_DESCRIPTION.filter((e) => e.id > DomainKind.NONE && e.id < DomainKind.MISSING);

  private readonly KEY = 'ResponseKind';
  private readonly path = 'responsedomains';

  constructor(private  messages: QddtMessageService, private properties: QddtPropertyStoreService ) {
    const page = this.getPageSearch();
    if ((!page.keys) || !page.keys.has(this.KEY)) {
      page.keys = new Map( [ [this.KEY, DomainKind[DomainKind.SCALE] ] ] );
      this.setPageSearch(page);
    }
    const kind: string = page.keys.get(this.KEY);
    this.domainType = DomainKind[kind];
  }

  ngOnChanges(changes: SimpleChanges): void {
    // if (changes[''])
  }

  onSelectDomainType(id: DomainKind) {
    this.domainType = id;
    const page = this.getPageSearch();
    page.keys = new Map( [ [this.KEY, DomainKind[id] ] ] );
    this.setPageSearch(page);
    this.messages.sendAction( { id: this.KEY,  action: ActionKind.Filter,
      object: page.keys } );
  }

  private setPageSearch(pageSearch: IPageSearch ) {
    this.properties.set(this.path, pageSearch);
  }

  private getPageSearch(): IPageSearch {
    const pageSearch = this.properties.get(this.path);
    return (pageSearch) ? pageSearch :
     { kind: ElementKind.RESPONSEDOMAIN, key: '*', page : new Page(), sort : 'modified,desc' };
  }

}


