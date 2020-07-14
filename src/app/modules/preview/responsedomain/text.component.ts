import { Component, Input, OnChanges, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { Category, UserResponse, ResponseCardinality, delay } from '../../../lib';

@Component({
  selector: 'qddt-preview-rd-text',
  template: `
<ng-container *ngIf="managedRepresentation">
  <qddt-textarea [id]="identifier"  name="text" [label]="managedRepresentation.label" ngModel  [ngClass]= "{ required : minimum > 0 }"
      data-length=minimum >
  </qddt-textarea>
</ng-container>
`
})

export class ResponsedomainTextComponent implements OnChanges {
  @Output() selectedEvent = new EventEmitter<UserResponse[]>();
  @Input() managedRepresentation: Category;

  public inputLimit: ResponseCardinality
  public minimum = 0;
  public identifier;

  // private readonly delay = () => new Promise(resolve => setTimeout(resolve, 20));

  constructor() {
    this.identifier = 'TXT-' + ident++;
  }

  public ngOnChanges(changes: SimpleChanges) {

    if (changes.managedRepresentation && changes.managedRepresentation.currentValue) {
      this.inputLimit = this.managedRepresentation.inputLimit;
      this.minimum = this.inputLimit.minimum;
      delay(20).then(data => {
        const element = document.getElementById(this.identifier);
        element.firstElementChild.firstElementChild.setAttribute('data-length', this.inputLimit.maximum.toString());
        element.firstElementChild.firstElementChild.setAttribute('maxlength', this.inputLimit.maximum.toString());
        M.CharacterCounter.init(element.firstElementChild.firstElementChild);
        M.updateTextFields();
      });
    }
  }
}


let ident = 0;
