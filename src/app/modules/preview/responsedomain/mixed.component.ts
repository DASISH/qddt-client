import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Category, ResponseCardinality, UserResponse, Parameter } from '../../../lib/classes';


@Component({
  selector: 'qddt-preview-rd-mixed',
  template: `
<ng-container>
  <label *ngIf="managedRepresentation && managedRepresentation.anchors.length > 0" class="active teal-text" title="Response Cardinality: from {{responseCardinality.minimum}} to {{responseCardinality.maximum}}">
      {{ managedRepresentation.label }} v.<qddt-version [element]="managedRepresentation" ></qddt-version>
  </label>
    <ng-container *ngFor="let rep of managedRepresentation.anchors; let idx = index;">
      <ng-container [ngSwitch]="rep.categoryKind">
        <qddt-preview-rd-scale *ngSwitchCase="'SCALE'"
          [managedRepresentation]="rep"
          [inputGroupName]="managedRepresentation.label"
          [displayLayout]="displayLayout"
          [parameterIn]="parameterIn"
          (selectedEvent)="onSelectedEvent($event,idx)">
        </qddt-preview-rd-scale>
        <qddt-preview-rd-codelist *ngSwitchCase="'LIST'"
          [managedRepresentation]="rep"
          [responseCardinality]="responseCardinality"
          [inputGroupName]="managedRepresentation.label"
          [parameterIn]="parameterIn"
          (selectedEvent)="onSelectedEvent($event,idx)">
        </qddt-preview-rd-codelist>
        <qddt-preview-rd-datetime *ngSwitchCase="'DATETIME'"
          [managedRepresentation]="rep"
          (selectedEvent)="onSelectedEvent($event,idx)">
        </qddt-preview-rd-datetime>
        <qddt-preview-rd-numeric *ngSwitchCase="'NUMERIC'"
          [managedRepresentation]="rep"
         (selectedEvent)="onSelectedEvent($event,idx)">
        </qddt-preview-rd-numeric>
        <qddt-preview-rd-text *ngSwitchCase="'TEXT'"
          [managedRepresentation]="rep"
          [parameterIn]="parameterIn"
         (selectedEvent)="onSelectedEvent($event,idx)">
        </qddt-preview-rd-text>
        <qddt-preview-rd-missing *ngSwitchCase="'MISSING_GROUP'"
          [managedRepresentation]="rep"
          [inputGroupName]="managedRepresentation.label"
          [parameterIn]="parameterIn"
          (selectedEvent)="onSelectedEvent($event,idx)">
        </qddt-preview-rd-missing>
      </ng-container>
    </ng-container>
</ng-container>
`
})

export class ResponsedomainMixedComponent {
  @Output() selectedEvent = new EventEmitter<UserResponse[]>();
  @Input() managedRepresentation: Category;
  @Input() responseCardinality: ResponseCardinality;
  @Input() parameterIn: Parameter[] = [];
  @Input() displayLayout = 0;

  public missingRef;

  public onSelectedEvent(idxs: UserResponse[], missingRef?: any) {
    if (missingRef) {
      console.debug('missingref');
    }
    this.selectedEvent.emit(idxs);
  }
}
