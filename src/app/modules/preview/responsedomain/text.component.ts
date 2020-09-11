import { Component, Input, OnChanges, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { Category, UserResponse, ResponseCardinality, delay, hasChanges, Parameter } from '../../../lib';

@Component({
  selector: 'qddt-preview-rd-text',
  template: `
<ng-container *ngIf="managedRepresentation">
  <qddt-textarea [id]="identifier"  [label]="managedRepresentation.label" ngModel
    [minlength]="inputLimit.minimum"
    [maxlength]="inputLimit.maximum"
    [required]="isRequired(inputLimit)"
    (ngModelChange)="onModelChange($event)" >
  </qddt-textarea>
</ng-container>
`
})

export class ResponsedomainTextComponent implements OnChanges {
  @Output() selectedEvent = new EventEmitter<UserResponse[]>();
  @Input() managedRepresentation: Category;
  @Input() inParameters: Map<string, Parameter>
  @Input() parameterIn: Parameter[] = [];


  public inputLimit: ResponseCardinality
  public identifier;

  public readonly isRequired = (inputLimit) => inputLimit.minimum > 0;

  constructor() {
    this.identifier = 'TXT-' + ident++;
  }

  public ngOnChanges(changes: SimpleChanges) {

    if (hasChanges(changes.managedRepresentation)) {
      this.inputLimit = this.managedRepresentation.inputLimit;
      delay(20).then(() => {
        const element = document.getElementById(this.identifier);
        element.firstElementChild.firstElementChild.setAttribute('data-length', this.inputLimit.maximum.toString());
        element.firstElementChild.firstElementChild.setAttribute('maxlength', this.inputLimit.maximum.toString());
        element.firstElementChild.firstElementChild.setAttribute('minlength', this.inputLimit.minimum.toString());
        M.CharacterCounter.init(element.firstElementChild.firstElementChild);
        M.updateTextFields();
      });
    }
  }

  public onModelChange(value) {
    this.selectedEvent.emit([{ label: '', value }])
  }
}


let ident = 0;
