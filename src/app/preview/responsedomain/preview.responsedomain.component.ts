import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ResponseDomain, DomainKind } from '../../responsedomain/responsedomain.classes';
import { Category, ResponseCardinality } from '../../category/category.classes';

@Component({
  selector: 'qddt-preview-responsedomain',
  moduleId: module.id,
  styles: [' .row { min-height: 1rem; margin-bottom: 5px; !important;}',
           ' .td { padding: 0px;}'
  ],
  template: `
    <div *ngIf="responseType" class="card-panel grey lighten-5 black-text" style="padding-left:3%; padding-right:5%; margin: 1%">
    <label *ngIf="responseType !== refKind.MIXED" class="active teal-text">
      {{ responseDomain?.name }}(V<qddt-version [element]="rep"></qddt-version>)
    </label>
    <div [ngSwitch]="responseType">
    <qddt-preview-rd-mixed *ngSwitchCase="refKind.MIXED"
        [managedRepresentation]="rep"
        [displayLayout]="displayLayout"
        [responseCardinality]="cardinality">
    </qddt-preview-rd-mixed>
    <qddt-preview-rd-scale *ngSwitchCase="refKind.SCALE"
          [managedRepresentation]="rep"
          [displayLayout]="displayLayout">
      </qddt-preview-rd-scale>
      <qddt-preview-rd-codelist *ngSwitchCase="refKind.LIST"
          [managedRepresentation]="rep"
          [responseCardinality]="cardinality">
      </qddt-preview-rd-codelist>
      <qddt-preview-rd-datetime *ngSwitchCase="refKind.DATETIME" [managedRepresentation]="rep"></qddt-preview-rd-datetime>
      <qddt-preview-rd-numeric *ngSwitchCase="refKind.NUMERIC" [managedRepresentation]="rep"></qddt-preview-rd-numeric>
      <qddt-preview-rd-text *ngSwitchCase="refKind.TEXT" [managedRepresentation]="rep"></qddt-preview-rd-text>
    </div>
  </div>`,
  providers: [],
})

export class PreviewResponsedomainComponent implements OnChanges {
  @Input() responseDomain: ResponseDomain;

  public refKind = DomainKind;
  public responseType: DomainKind;
  public cardinality: ResponseCardinality;
  public displayLayout: number;
  public rep: Category;

  ngOnChanges(changes: SimpleChanges) {
    if (this.responseDomain) {
      this.responseType = DomainKind[this.responseDomain.responseKind];
      this.rep = new Category( this.responseDomain.managedRepresentation);
      this.cardinality = new ResponseCardinality(this.responseDomain.responseCardinality);
      this.displayLayout = +this.responseDomain.displayLayout;
    }
  }
}
