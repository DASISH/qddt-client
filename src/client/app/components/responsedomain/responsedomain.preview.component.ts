import { Component, Input, OnChanges } from '@angular/core';
import { ResponseDomain } from './responsedomain.service';
import { DomainType, DomainTypeDescription } from './responsedomain.constant';

@Component({
  selector: 'qddt-responsedomain-preview',
  moduleId: module.id,
  template: `<div *ngIf="isVisible" class="card-panel lighten-2 black-text">
        <label *ngIf="domainType !== domainTypeDef.MIXED"
          class="active teal-text">{{responseDomain?.name}}
          Version: {{responseDomain?.version?.major}}.{{responseDomain?.version?.minor}}</label>
        <div [ngSwitch]="domainType">
					<qddt-responsedomain-scale *ngSwitchCase="domainTypeDef.SCALE"
					  [responseDomain]="responseDomain">
          </qddt-responsedomain-scale>
					<qddt-responsedomain-datetime *ngSwitchCase="domainTypeDef.DATETIME"
					  [responseDomain]="responseDomain"></qddt-responsedomain-datetime>
					<qddt-responsedomain-numeric *ngSwitchCase="domainTypeDef.NUMERIC"
					  [responseDomain]="responseDomain"></qddt-responsedomain-numeric>
					<qddt-responsedomain-codelist *ngSwitchCase="domainTypeDef.LIST"
            [responseDomain]="responseDomain"></qddt-responsedomain-codelist>
					<qddt-responsedomain-text *ngSwitchCase="domainTypeDef.TEXT"
					  [responseDomain]="responseDomain"></qddt-responsedomain-text>
					<qddt-responsedomain-missing *ngSwitchCase="domainTypeDef.MISSING"
					  [responseDomain]="responseDomain"></qddt-responsedomain-missing>
          <qddt-responsedomain-mixed *ngSwitchCase="domainTypeDef.MIXED"
					  [responseDomain]="responseDomain"></qddt-responsedomain-mixed>
				</div></div>`,
  styles: [],
  providers: [],
})

export class PreviewComponent implements OnChanges {
  public domainTypeDef = DomainType;
  @Input() isVisible: boolean;
  @Input() responseDomain: ResponseDomain;
  private domainType: DomainType;

  ngOnChanges() {
    if (this.isVisible) {
      this.domainType = DomainTypeDescription.find(e=>e.name === this.responseDomain['responseKind']).id;
    }
  }
}
