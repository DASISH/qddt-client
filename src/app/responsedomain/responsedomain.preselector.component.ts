import { Component, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import { QddtMessageService } from '../core/services/message.service';
import { QddtPropertyStoreService } from '../core/services/property.service';
import { DOMAIN_TYPE_DESCRIPTION, DomainKind } from './responsedomain.classes';
import { ActionKind, ElementKind, Page, IPageSearch} from '../shared/classes';

@Component({
  selector: 'qddt-responsedomain-preselector',

  template: `
<div class="card-action">
  <div class="row">
    <!--<div class="col s1 input-field" style="padding-right: 0;padding-left: 0;margin-top: 0">-->
      <!--<select id="globalfilter1" name="globalfilter1t"-->
              <!--[ngModel]="3"-->
              <!--(ngModelChange)="onChangeDegreeSlope($event)"-->
              <!--materialize="material_select" required>-->
        <!--<option [value]="0">No filter</option>-->
        <!--<option [value]="1">Survey</option>-->
        <!--<option [value]="2">Study</option>-->
        <!--<option [value]="3">Module</option>-->
        <!--<option [value]="4">Concept</option>-->
      <!--</select>-->
    <!--</div>-->

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
    const pageSearch = this.properties.get(this.path) as IPageSearch ||
        { kind: ElementKind.RESPONSEDOMAIN, key: '', page: new Page(), sort: 'modified,desc' } as IPageSearch;
    pageSearch.keys = map;
    this.properties.set(this.path, pageSearch);
  }

  private getKey(): Map<string, string> {
    return  (this.properties.get(this.path) as IPageSearch).keys ||
            new Map( [ [this.KEY, DomainKind[DomainKind.SCALE] ] ] );
  }

}


