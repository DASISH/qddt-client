import { Component, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { Category, DomainKind, ResponseCardinality, ResponseDomain, UserResponse } from '../../../lib';

@Component({
  selector: 'qddt-preview-responsedomain',

  styles: [],
  template: `
  <ng-container *ngIf="responseDomain">
    <div *ngIf="responseType" class="row card-panel grey lighten-5 grey-text text-darken-1">
      <label *ngIf="responseType !== refKind.MIXED" >
          {{ responseDomain?.name }}(V<qddt-version [element]="rep"></qddt-version>)
      </label>
        <div [ngSwitch]="responseType">
          <qddt-preview-rd-mixed id="{{compId}}" *ngSwitchCase="refKind.MIXED"
            [managedRepresentation]="rep"
            [displayLayout]="displayLayout"
            [responseCardinality]="cardinality"
            (selectedEvent)="onSelectedEvent($event)">
          </qddt-preview-rd-mixed>
          <qddt-preview-rd-scale id="{{compId}}" *ngSwitchCase=refKind.SCALE
            [managedRepresentation]="rep"
            [displayLayout]="displayLayout"
            (selectedEvent)="onSelectedEvent($event)">
          </qddt-preview-rd-scale>
          <qddt-preview-rd-codelist id="{{compId}}" *ngSwitchCase=refKind.LIST
            [managedRepresentation]="rep"
            [responseCardinality]="cardinality"
            (selectedEvent)="onSelectedEvent($event)">
          </qddt-preview-rd-codelist>
          <qddt-preview-rd-datetime id="{{compId}}" *ngSwitchCase="refKind.DATETIME"
            [managedRepresentation]="rep"
            (selectedEvent)="onSelectedEvent($event)">
          </qddt-preview-rd-datetime>
          <qddt-preview-rd-numeric id="{{compId}}" *ngSwitchCase="refKind.NUMERIC"
            [managedRepresentation]="rep"
            (selectedEvent)="onSelectedEvent($event)">
          </qddt-preview-rd-numeric>
          <qddt-preview-rd-text id="{{compId}}" *ngSwitchCase="refKind.TEXT"
            [managedRepresentation]="rep"
            (selectedEvent)="onSelectedEvent($event)">
          </qddt-preview-rd-text>
          <qddt-preview-rd-missing id="{{compId}}" *ngSwitchCase="refKind.MISSING"
            [managedRepresentation]="rep"
            (selectedEvent)="onSelectedEvent($event)">
          </qddt-preview-rd-missing>
        </div>
    </div>
  </ng-container>`,
  providers: [],
})

export class PreviewResponsedomainComponent implements OnChanges {
  @Output() selectedEvent = new EventEmitter<UserResponse[]>();
  @Input() responseDomain: ResponseDomain;

  public refKind = DomainKind;
  public responseType: DomainKind;
  public cardinality: ResponseCardinality;
  public displayLayout: number;
  public rep: Category;
  public compId = Math.round(Math.random() * 10000);

  public values: {};

  public ngOnChanges(changes: SimpleChanges) {
    if (this.responseDomain) {
      this.responseType = DomainKind[this.responseDomain.responseKind];
      this.rep = new Category(this.responseDomain.managedRepresentation);
      this.cardinality = new ResponseCardinality(this.responseDomain.responseCardinality);
      this.displayLayout = +this.responseDomain.displayLayout;
    }
  }

  public onSelectedEvent(idxs: UserResponse[]) {
    this.selectedEvent.emit(idxs);
  }


}
