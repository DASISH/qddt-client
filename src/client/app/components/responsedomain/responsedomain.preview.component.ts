import { Component, Input, OnChanges } from '@angular/core';
import { ResponseDomain } from './responsedomain.service';
import { DomainType, DomainTypeDescription } from './responsedomain.constant';

@Component({
  selector: 'qddt-responsedomain-preview',
  moduleId: module.id,
  template: `<div *ngIf="isVisible" class="card-panel lighten-2">
        <div [ngSwitch]="domainType">
					<responsedomain-scale *ngSwitchCase="domainTypeDef.SCALE"
					  [responseDomain]="responseDomain">
          </responsedomain-scale>
					<responsedomain-datetime *ngSwitchCase="domainTypeDef.DATETIME"
					  [responseDomain]="responseDomain"></responsedomain-datetime>
					<responsedomain-numeric *ngSwitchCase="domainTypeDef.NUMERIC"
					  [responseDomain]="responseDomain"></responsedomain-numeric>
					<responsedomain-codelist *ngSwitchCase="domainTypeDef.LIST"
            [responseDomain]="responseDomain"></responsedomain-codelist>
					<responsedomain-categorylist *ngSwitchCase="domainTypeDef.CategoryList"
					  [responseDomain]="responseDomain"></responsedomain-categorylist>
					<responsedomain-text *ngSwitchCase="domainTypeDef.TEXT"
					  [responseDomain]="responseDomain"></responsedomain-text>
					<responsedomain-missing *ngSwitchCase="domainTypeDef.MISSING"
					  [responseDomain]="responseDomain"></responsedomain-missing>
          <responsedomain-mixed *ngSwitchCase="domainTypeDef.MIXED"
					  [responseDomain]="responseDomain"></responsedomain-mixed>
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
