import { Component, Input, OnChanges } from '@angular/core';
import { ResponseDomain } from './responsedomain.service';
import { DomainType } from './responsedomain.constant';

@Component({
  selector: 'qddt-responsedomain-mixed',
  moduleId: module.id,
  template: `<div>
    <label *ngIf="mixedDomains && mixedDomains.length > 0"
      class="active teal-text">{{mixedDomains[0]?.name}}
      Version: {{mixedDomains[0]?.version?.major}}.{{mixedDomains[0]?.version?.minor}}</label>
      <div *ngFor="let domain of mixedDomains">
        <div [ngSwitch]="domain.domainType">
					<qddt-responsedomain-scale *ngSwitchCase="domainTypeDef.SCALE"
					  [responseDomain]="domain">
          </qddt-responsedomain-scale>
					<qddt-responsedomain-datetime *ngSwitchCase="domainTypeDef.DATETIME"
					  [responseDomain]="domain">
          </qddt-responsedomain-datetime>
					<qddt-responsedomain-numeric *ngSwitchCase="domainTypeDef.NUMERIC"
					  [responseDomain]="domain">
          </qddt-responsedomain-numeric>
					<qddt-responsedomain-codelist *ngSwitchCase="domainTypeDef.LIST"
            [responseDomain]="domain">
          </qddt-responsedomain-codelist>
					<qddt-responsedomain-text *ngSwitchCase="domainTypeDef.TEXT"
					  [responseDomain]="domain">
          </qddt-responsedomain-text>
          <qddt-responsedomain-missing *ngSwitchCase="domainTypeDef.MISSING"
					  [responseDomain]="domain">
          </qddt-responsedomain-missing>
		    </div>
      </div>
    </div>`,
  styles: [],
  providers: [],
})

export class ResponsedomainMixedComponent implements OnChanges {
  public domainTypeDef = DomainType;
  @Input() responseDomain: ResponseDomain;
  mixedDomains: any[];

  ngOnChanges() {
    this.mixedDomains = [];
    let missing = null;
    let rep = this.responseDomain.managedRepresentation;
    for (let i = 0; i < rep.children.length; i++) {
      let rd = new ResponseDomain();
      rd['id'] = new Date().toString();
      rd['responseCardinality'] = { minimum: '1', maximum: '1' };
      rd['managedRepresentation'] = rep.children[i];
      rd['version'] = rep.children[i]['version'];
      rd['name'] = rep.children[i]['name'] || '';
      if (rep.children[i].categoryType === 'SCALE') {
        rd['domainType'] = this.domainTypeDef.SCALE;
        rd['responseKind'] = 'SCALE';
      } else if (rep.children[i].categoryType === 'NUMERIC') {
        rd['domainType'] = this.domainTypeDef.NUMERIC;
        rd['responseKind'] = 'NUMERIC';
      } else if (rep.children[i].categoryType === 'TEXT') {
        rd['domainType'] = this.domainTypeDef.TEXT;
        rd['responseKind'] = 'TEXT';
      } else if (rep.children[i].categoryType === 'LIST') {
        rd['domainType'] = this.domainTypeDef.LIST;
        rd['responseKind'] = 'LIST';
      } else {
        rd['domainType'] = this.domainTypeDef.MISSING;
        rd['responseKind'] = 'MISSING';
        missing = rd;
        continue;
      }
      rd['displayLayout'] = this.responseDomain['displayLayout'] || 0;
      this.mixedDomains.push(rd);
    }

    if(missing !== null) {
      this.mixedDomains.push(missing);
    }
  }
}
