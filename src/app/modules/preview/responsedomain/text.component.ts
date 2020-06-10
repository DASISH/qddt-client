import { Component, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { Category, UserResponse } from '../../../lib';

@Component({
  selector: 'qddt-preview-rd-text',

  template: `
    <div class="row" *ngIf="managedRepresentation">

       <textarea id="textarea-{{managedRepresentation?.id}}"
         class="materialize-textarea" data-length="high" validate (change)="checkOption($event.target.value)"></textarea>
       <label>Text length from {{ low }} to {{ high }}</label>
     </div>`,
  styles: [],
})

export class ResponsedomainTextComponent implements OnChanges {
  @Output() selectedEvent = new EventEmitter<UserResponse[]>();
  @Input() managedRepresentation: Category;
  low = 0;
  high = 20;

  public ngOnChanges() {
    const rep = this.managedRepresentation;
    if (rep) {
      if (rep.inputLimit.maximum) {
        this.high = +rep.inputLimit.maximum;
      }
      if (rep.inputLimit.minimum) {
        this.low = +rep.inputLimit.minimum;
      }
    }
  }

  public checkOption(option: any) {
    this.selectedEvent.emit([{ label: this.managedRepresentation.label, value: option }]);
  }
}
