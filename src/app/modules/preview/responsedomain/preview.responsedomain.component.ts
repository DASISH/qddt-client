import {AfterViewInit, Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {Category, DomainKind, ResponseCardinality, ResponseDomain} from '../../../lib';

@Component({
  selector: 'qddt-preview-responsedomain',

  styles: [  ],
  template: `
    <div *ngIf="responseType" class="row card-panel grey lighten-5 grey-text text-darken-1">
    <label *ngIf="responseType !== refKind.MIXED" class="teal-text">
        {{ responseDomain?.name }}(V<qddt-version [element]="rep"></qddt-version>)
    </label>
    <div [ngSwitch]="responseType">
      <qddt-preview-rd-mixed id="{{compId}}" *ngSwitchCase="refKind.MIXED" [managedRepresentation]="rep" [displayLayout]="displayLayout" [responseCardinality]="cardinality"></qddt-preview-rd-mixed>
      <qddt-preview-rd-scale id="{{compId}}" *ngSwitchCase="refKind.SCALE" [managedRepresentation]="rep" [displayLayout]="displayLayout"></qddt-preview-rd-scale>
      <qddt-preview-rd-codelist id="{{compId}}" *ngSwitchCase="refKind.LIST" [managedRepresentation]="rep" [responseCardinality]="cardinality"></qddt-preview-rd-codelist>
      <qddt-preview-rd-datetime id="{{compId}}" *ngSwitchCase="refKind.DATETIME" [managedRepresentation]="rep"></qddt-preview-rd-datetime>
      <qddt-preview-rd-numeric id="{{compId}}" *ngSwitchCase="refKind.NUMERIC" [managedRepresentation]="rep"></qddt-preview-rd-numeric>
      <qddt-preview-rd-text id="{{compId}}" *ngSwitchCase="refKind.TEXT" [managedRepresentation]="rep"></qddt-preview-rd-text>
      <qddt-preview-rd-missing id="{{compId}}" *ngSwitchCase="refKind.MISSING" [managedRepresentation]="rep"></qddt-preview-rd-missing>
    </div>
  </div>`,
  providers: [],
})

export class PreviewResponsedomainComponent implements OnChanges, AfterViewInit {
  @Input() responseDomain: ResponseDomain;

  public refKind = DomainKind;
  public responseType: DomainKind;
  public cardinality: ResponseCardinality;
  public displayLayout: number;
  public rep: Category;
  public compId = Math.round( Math.random() * 10000);

  ngOnChanges(changes: SimpleChanges) {
    if (this.responseDomain) {
      this.responseType = DomainKind[this.responseDomain.responseKind];
      this.rep = new Category( this.responseDomain.managedRepresentation);
      this.cardinality = new ResponseCardinality(this.responseDomain.responseCardinality);
      this.displayLayout = +this.responseDomain.displayLayout;
    }
  }
  ngAfterViewInit(): void {
    // document.querySelectorAll('select')
    // .forEach( select => M.FormSelect.init(select));
  }

}
