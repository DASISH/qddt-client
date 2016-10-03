import { Component, Input, OnChanges } from '@angular/core';
import { ResponseDomain } from './responsedomain.service';
import { DomainType, DomainTypeDescription } from './responsedomain.constant';

@Component({
  selector: 'qddt-responsedomain-preview',
  moduleId: module.id,
  template: `<div *ngIf="isVisible" class="card-panel lighten-2">
        <div [ngSwitch]="domainType">
					<responsedomain-scale *ngSwitchWhen="domainTypeDef.SCALE"
					  [responseDomain]="responseDomain">
          </responsedomain-scale>
					<responsedomain-datetime *ngSwitchWhen="domainTypeDef.DATETIME"
					  [responseDomain]="responseDomain"></responsedomain-datetime>
					<responsedomain-numeric *ngSwitchWhen="domainTypeDef.NUMERIC"
					  [responseDomain]="responseDomain"></responsedomain-numeric>
					<responsedomain-codelist *ngSwitchWhen="domainTypeDef.LIST"
            [responseDomain]="responseDomain"></responsedomain-codelist>
					<responsedomain-categorylist *ngSwitchWhen="domainTypeDef.CategoryList"
					  [responseDomain]="responseDomain"></responsedomain-categorylist>
					<responsedomain-text *ngSwitchWhen="domainTypeDef.TEXT"
					  [responseDomain]="responseDomain"></responsedomain-text>
					<responsedomain-missing *ngSwitchWhen="domainTypeDef.Missing"
					  [responseDomain]="responseDomain"></responsedomain-missing>
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
