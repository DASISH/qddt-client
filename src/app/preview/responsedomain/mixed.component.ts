import { Component, Input, OnChanges } from '@angular/core';
import { ResponseDomain, DomainKind } from '../../responsedomain/responsedomain.classes';

@Component({
  selector: 'qddt-preview-rd-mixed',
  moduleId: module.id,
  template: `<div>
    <label *ngIf="mixedDomains && mixedDomains.length > 0"
      class="active teal-text">{{ mixedDomains[0]?.name }}
      <qddt-version [element]="mixedDomains" ></qddt-version></label>
      <div *ngFor="let domain of mixedDomains">
        <div [ngSwitch]="domain.responseKind">
					<qddt-preview-rd-scale *ngSwitchCase="'SCALE'" [managedRepresentation]="domain"> </qddt-preview-rd-scale>
					<qddt-preview-rd-datetime *ngSwitchCase="'DATETIME'" [managedRepresentation]="domain"></qddt-preview-rd-datetime>
					<qddt-preview-rd-numeric *ngSwitchCase="'NUMERIC'" [managedRepresentation]="domain"></qddt-preview-rd-numeric>
					<qddt-preview-rd-codelist *ngSwitchCase="'LIST'" [managedRepresentation]="domain"></qddt-preview-rd-codelist>
					<qddt-preview-rd-text *ngSwitchCase="'TEXT'" [managedRepresentation]="domain"></qddt-preview-rd-text>
          <qddt-preview-rd-missing *ngSwitchCase="'MISSING'" [managedRepresentation]="domain"></qddt-preview-rd-missing>
		    </div>
      </div>
    </div>`,
  styles: [],
  providers: [],
})

export class ResponsedomainMixedComponent implements OnChanges {
  @Input() responseDomain: ResponseDomain;

  public domainTypeDef = DomainKind;
  public mixedDomains: any[];

  ngOnChanges() {
    this.mixedDomains = [];
    let missing = null;
    const rep = this.responseDomain.managedRepresentation;
    for (let i = 0; i < rep.children.length; i++) {
      const rd = new ResponseDomain();
      rd.managedRepresentation = rep.children[i];
      rd.version = rep.children[i]['version'];
      rd.name = rep.children[i]['name'] || '';
      rd.responseKind = 
      if (rep.children[i].categoryType === 'SCALE') {
        rd.responseKind = 'SCALE';
      } else if (rep.children[i].categoryType === 'NUMERIC') {
        rd.responseKind = 'NUMERIC';
      } else if (rep.children[i].categoryType === 'DATETIME') {
        rd.responseKind = 'DATETIME';
      } else if (rep.children[i].categoryType === 'TEXT') {
        rd.responseKind = 'TEXT';
      } else if (rep.children[i].categoryType === 'LIST') {
        rd.responseKind = 'LIST';
      } else {
        rd.responseKind = 'MISSING';
        missing = rd;
        continue;
      }
      rd.displayLayout = this.responseDomain.displayLayout || '0';
      this.mixedDomains.push(rd);
    }

    if (missing) {
      this.mixedDomains.push(missing);
    }
  }
}
