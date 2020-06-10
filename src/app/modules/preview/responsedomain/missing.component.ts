import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Category, UserResponse } from '../../../lib/classes';

@Component({
  selector: 'qddt-preview-rd-missing',

  template: `
<div *ngIf="missing?.children">
  <span style="font-weight: bold;"><label>Missing</label></span>
  <ul>
    <li *ngFor="let category of missing.children; let i = index;" >
      <span class="left" style="width: 30px; float: right; "> {{ category.code?.codeValue }} </span>
      <label>
        <input name="option-select" type="radio" (change)="checkOption(category)"/>
        <span >{{category.label}}</span>
      </label>
    </li>
  </ul>
</div>`,
  styles: [],
})

export class ResponsedomainMissingComponent {
  @Output() selectedEvent = new EventEmitter<UserResponse[]>();
  @Input() managedRepresentation: Category;

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
