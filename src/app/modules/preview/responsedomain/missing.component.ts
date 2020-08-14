import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { Category, UserResponse } from '../../../lib/classes';
import { hasChanges } from 'src/app/lib/consts';

@Component({
  selector: 'qddt-preview-rd-missing',
  template: `
<ng-container *ngIf="missing?.children">
  <span style="font-weight: bold;">
    <label>Missing</label>
  </span>
    <div *ngFor="let category of missing.children;" >
      <span class="codeValue"> {{ category.code?.value }} </span>
      <label>
        <input [name]="inputGroupName" type="radio" (change)="checkOption(category)" [checked]="unchecked"/>
        <span >{{category.label}}</span>
      </label>
    </div>
</ng-container>
`,
})

export class ResponsedomainMissingComponent implements OnChanges {
  @Output() selectedEvent = new EventEmitter<UserResponse[]>();
  @Input() managedRepresentation: Category;
  @Input() inputGroupName = 'option-select'
  @Input() missingSelected = false

  public compId = Math.round(Math.random() * 10000);
  public unchecked = "";

  ngOnChanges(changes: SimpleChanges): void {
    if (hasChanges(changes.missingSelected)) {
      console.log(this.missingSelected);
      if (changes.missingSelected.currentValue === false) {
        this.unchecked = '';
      }
    }
  }

  public get missing() {
    if (this.managedRepresentation.categoryType === 'MISSING_GROUP') {
      return this.managedRepresentation;
    }
    return this.managedRepresentation.children.find(e => e.categoryType === 'MISSING_GROUP');
  }

  public checkOption(category: Category) {
    this.missingSelected = true;
    this.selectedEvent.emit([{ label: category.label, value: category.code.value, isMissing: true }]);
  }
}
