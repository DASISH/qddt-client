import { Component, OnInit } from '@angular/core';
import {
  ActionKind,
  DOMAIN_TYPE_DESCRIPTION,
  DomainKind,
  ElementKind,
  IPageSearch,
  MessageService,
  PageSearch,
  PropertyStoreService,
  CategoryKind,
  UserService
} from '../../lib';

@Component({
  selector: 'qddt-responsedomain-preselector',
  styles: ['.row { margin-bottom: auto; }'],
  template: `
<div style="padding-top: 1rem;">
  <div class="row">
    <div class="col left" *ngFor="let domain of domainTypeDescription" >
    <label>
        <input name="DOMAIN-TYPE-GROUP" type="radio"
        (click)="onSelectDomainType(domain.id)" [checked]="domainType === domain.id"/>
        <span class="white-text">{{ domain.label }}</span>
      </label>
    </div>
  </div>
</div>`
})
export class ResponsePreSelector implements OnInit {

  public domainType = DomainKind.SCALE;
  public readonly domainTypeDescription: { id: DomainKind; label: string; categoryType: CategoryKind; }[];

  private readonly KEY = 'ResponseKind';
  private readonly path = 'responsedomains';

  constructor(private messages: MessageService, private properties: PropertyStoreService, private userService: UserService) {
    // console.log(userService.getUser().role || JSON);
    if (userService.getUser().role.find(p => p.authority === 'ROLE_ADMIN')) {
      this.domainTypeDescription = DOMAIN_TYPE_DESCRIPTION.filter((e) => e.id !== DomainKind.NONE && e.id !== DomainKind.MISSING);
    } else {
      this.domainTypeDescription = DOMAIN_TYPE_DESCRIPTION.filter((e) => e.id > DomainKind.NONE && e.id < DomainKind.MISSING);
    }
  }

  ngOnInit(): void {
    const kind = this.getPageSearch().keys.get(this.KEY);
    if (kind) {
      this.domainType = DomainKind[kind];
    }
  }

  onSelectDomainType(id: DomainKind) {
    // console.log('onSelectDomainType');
    const pageSearch = this.getPageSearch();
    this.domainType = id;
    pageSearch.keys.set(this.KEY, DomainKind[id]);
    this.setPageSearch(pageSearch);
    this.messages.sendAction({ id: this.KEY, action: ActionKind.Filter, object: null });
  }

  private setPageSearch(pageSearch: IPageSearch) {
    this.properties.set(this.path, pageSearch);
  }

  private getPageSearch(): IPageSearch {
    return (this.properties.get(this.path) || new PageSearch({ kind: ElementKind.RESPONSEDOMAIN })) as IPageSearch;
  }

}


