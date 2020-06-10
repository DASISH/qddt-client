import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Category, ResponseCardinality, UserResponse } from '../../../lib/classes';


@Component({
  selector: 'qddt-preview-rd-mixed',
  template: `
<div>
  <label *ngIf="managedRepresentation && managedRepresentation.children.length > 0" class="active teal-text">
      {{ managedRepresentation.label }} v.<qddt-version [element]="managedRepresentation" ></qddt-version>
  </label>
  <div *ngFor="let rep of managedRepresentation.children">
    <div [ngSwitch]="rep.categoryType">
      <qddt-preview-rd-scale *ngSwitchCase="'SCALE'" [managedRepresentation]="rep" [displayLayout]="displayLayout"
        (selectedEvent)="onSelectedEvent($event)">
      </qddt-preview-rd-scale>
      <qddt-preview-rd-codelist *ngSwitchCase="'LIST'" [managedRepresentation]="rep" [responseCardinality]="responseCardinality"
        (selectedEvent)="onSelectedEvent($event)">
      </qddt-preview-rd-codelist>
      <qddt-preview-rd-datetime *ngSwitchCase="'DATETIME'" [managedRepresentation]="rep" (selectedEvent)="onSelectedEvent($event)"></qddt-preview-rd-datetime>
      <qddt-preview-rd-numeric *ngSwitchCase="'NUMERIC'" [managedRepresentation]="rep" (selectedEvent)="onSelectedEvent($event)"></qddt-preview-rd-numeric>
      <qddt-preview-rd-text *ngSwitchCase="'TEXT'" [managedRepresentation]="rep" (selectedEvent)="onSelectedEvent($event)"></qddt-preview-rd-text>
      <qddt-preview-rd-missing *ngSwitchCase="'MISSING_GROUP'" [managedRepresentation]="rep" (selectedEvent)="onSelectedEvent($event)"></qddt-preview-rd-missing>
    </div>
  </div>
</div>
`
})

export class ResponsedomainMixedComponent {
  @Output() selectedEvent = new EventEmitter<UserResponse[]>();
  @Input() managedRepresentation: Category;
  @Input() responseCardinality: ResponseCardinality;
  @Input() displayLayout = 0;


  public onSelectedEvent(idxs: UserResponse[]) {
    this.selectedEvent.emit(idxs);
  }
}
