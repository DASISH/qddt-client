import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DomainType, DomainTypeDescription } from '../../components/responsedomain/responsedomain.constant';
import { ResponseDomain } from '../../components/responsedomain/responsedomain.service';

@Component({
  selector: 'qddt-preview-responsedomain',
  moduleId: module.id,
  styles: [' .row { min-height: 1rem; margin-bottom: 5px; !important;}'],
  template: `<div *ngIf="isVisible && domainType" class="card-panel grey lighten-5 black-text" 
              style="padding-left:3%; padding-right:5%; margin: 1%">
        <label *ngIf="domainType !== domainTypeDef.MIXED"
          class="active teal-text">{{responseDomain?.name}}
          (V<qddt-version [element]="responseDomain"></qddt-version>)</label>
        <div [ngSwitch]="domainType">
					<qddt-preview-rd-scale *ngSwitchCase="domainTypeDef.SCALE"
					  [responseDomain]="responseDomain"></qddt-preview-rd-scale>
					<qddt-preview-rd-datetime *ngSwitchCase="domainTypeDef.DATETIME"
					  [responseDomain]="responseDomain"></qddt-preview-rd-datetime>
					<qddt-preview-rd-numeric *ngSwitchCase="domainTypeDef.NUMERIC"
					  [responseDomain]="responseDomain"></qddt-preview-rd-numeric>
					<qddt-preview-rd-codelist *ngSwitchCase="domainTypeDef.LIST"
            [responseDomain]="responseDomain"></qddt-preview-rd-codelist>
					<qddt-preview-rd-text *ngSwitchCase="domainTypeDef.TEXT"
					  [responseDomain]="responseDomain"></qddt-preview-rd-text>
					<qddt-preview-rd-missing *ngSwitchCase="domainTypeDef.MISSING"
					  [responseDomain]="responseDomain"></qddt-preview-rd-missing>
          <qddt-preview-rd-mixed *ngSwitchCase="domainTypeDef.MIXED"
					  [responseDomain]="responseDomain"></qddt-preview-rd-mixed>
				</div></div>`,
  providers: [],
})

export class PreviewResponsedomainComponent implements OnChanges {
  @Input() isVisible: boolean = true;
  @Input() responseDomain: ResponseDomain;
  public domainTypeDef = DomainType;
  private domainType: DomainType;

  ngOnChanges(changes: SimpleChanges) {
    if (this.isVisible && this.responseDomain !== undefined) {
      let ret = DomainTypeDescription.find(e=>e.name === this.responseDomain['responseKind']);
      if( ret !== undefined ) {
        this.domainType = ret.id;
      }
    }
  }
}
