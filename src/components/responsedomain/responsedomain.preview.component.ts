import {Component, Input, OnChanges} from 'angular2/core';
import {ResponseDomain} from './responsedomain.service';
import {LocalDatePipe} from '../../common/date_pipe';
import {DomainType} from './responsedomain.constant';
import {ResponsedomainNumericComponent} from './responsedomain.numeric.component';
import {ResponsedomainTextComponent} from './responsedomain.text.component';
import {ResponsedomainScaleComponent} from './responsedomain.scale.component';
import {ResponsedomainDatetimeComponent} from './responsedomain.datetime.component';
import {ResponsedomainCodeListComponent} from './responsedomain.codelist.component';
import {ResponsedomainCategoryListComponent} from './responsedomain.categorylist.component';
import {ResponsedomainMissingComponent} from './responsedomain.missing.component';

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
  pipes: [LocalDatePipe],
  providers: [],
  directives: [ResponsedomainNumericComponent,
    ResponsedomainTextComponent,
    ResponsedomainScaleComponent,
    ResponsedomainDatetimeComponent,
    ResponsedomainCodeListComponent,
    ResponsedomainCategoryListComponent,
    ResponsedomainMissingComponent
  ]
})

export class PreviewComponent implements OnChanges {
  public domainTypeDef = DomainType;
  @Input() isVisible: boolean;
  @Input() responseDomain: ResponseDomain;
  private domainType: DomainType;

  ngOnChanges() {
    if (this.isVisible) {
      let types = {
        'SCALE': DomainType.SCALE, 'LIST': DomainType.LIST,
        'MIXED': DomainType.MIXED, 'DATETIME': DomainType.DATETIME,
        'NUMERIC': DomainType.NUMERIC, 'TEXT': DomainType.TEXT
      };
      this.domainType = types[this.responseDomain['responseKind']];
    }
  }
}
