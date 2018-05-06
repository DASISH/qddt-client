import {Component, OnChanges, OnInit, SimpleChanges} from '@angular/core';
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
</div>` ,
styles: ['.row { margin-bottom: auto; }']
})
export class ResponsePreSelector implements OnChanges, OnInit {

  public domainType = DomainKind.SCALE;
  public domainTypeDescription = DOMAIN_TYPE_DESCRIPTION.filter((e) => e.id > DomainKind.NONE && e.id < DomainKind.MISSING);

  private readonly KEY = 'ResponseKind';
  private readonly path = 'responsedomains';

  constructor(private  messages: QddtMessageService, private properties: QddtPropertyStoreService ) {
    const kind: string = this.getKey().get(this.KEY);
    this.domainType = DomainKind[kind];
  }


  ngOnInit(): void {
    const kind: string = this.getKey().get(this.KEY);
    this.domainType = DomainKind[kind];
  }

  ngOnChanges(changes: SimpleChanges): void {
    // if (changes[''])
  }

  onSelectDomainType(id: DomainKind) {
    this.domainType = id;
    this.setKey(new Map( [ [this.KEY, DomainKind[id] ] ] ));
    this.messages.sendAction( { id: this.KEY,  action: ActionKind.Filter, object: this.getKey() } );
  }

  private setKey(map: Map<string, string> ) {
    let pageSearch = this.properties.get(this.path);
    if (!pageSearch) {
      pageSearch = {kind: ElementKind.RESPONSEDOMAIN, key: '*', page: new Page(), sort: 'modified,desc'};
    }
    pageSearch.keys = map;
    this.properties.set(this.path, pageSearch);
  }

  private getKey(): Map<string, string> {
    const pageSearch = this.properties.get(this.path);
    if (pageSearch.keys ) {
      return pageSearch.keys;
    }
    return new Map( [ [this.KEY, DomainKind[DomainKind.SCALE] ] ] );
  }

}


