import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Category, UserResponse } from '../../../lib/classes';

@Component({
  selector: 'qddt-preview-rd-missing',
  template: `
<ng-container *ngIf="missing?.children">
  <span style="font-weight: bold;">
    <label>Missing</label>
  </span>
    <div *ngFor="let category of missing.children;" >
      <span class="codeValue"> {{ category.code?.codeValue }} </span>
      <label>
        <input [name]="inputGroupName" type="radio" (change)="checkOption(category)"/>
        <span >{{category.label}}</span>
      </label>
    </div>
</ng-container>
`,
})

export class ResponsedomainMissingComponent {
  @Output() selectedEvent = new EventEmitter<UserResponse[]>();
  @Input() managedRepresentation: Category;
  @Input() inputGroupName = 'option-select'

  public compId = Math.round(Math.random() * 10000);

  public get missing() {
    if (this.managedRepresentation.categoryType === 'MISSING_GROUP') {
      return this.managedRepresentation;
    }
    return this.managedRepresentation.children.find(e => e.categoryType === 'MISSING_GROUP');
  }

  public checkOption(category: Category) {
    this.selectedEvent.emit([{ label: category.label, value: category.code.codeValue }]);
  }
}
