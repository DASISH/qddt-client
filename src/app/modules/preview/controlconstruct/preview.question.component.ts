import { Component, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { QuestionConstruct, Parameter, UserResponse, hasChanges } from '../../../lib';
import * as uuid from 'uuid';
@Component({
  selector: 'qddt-preview-questionconstruct',
  template: `
  <ul class="row" *ngIf="controlConstruct">
    <qddt-parameter [inParameters]="controlConstruct.parameterIn" [outParameters]="controlConstruct.parameterOut">
    </qddt-parameter>

    <ng-container *ngIf="controlConstruct?.universe?.length>0">
      <li class="collection-item">
        <label>Universe</label>
      </li>
      <li class="collection-item" *ngFor="let universe of controlConstruct.universe">
        <p>{{ universe?.description }}</p>
      </li>
    </ng-container>

    <ng-container *ngIf="filterInstructions('PRE')?.length>0">
      <li class="collection-item">
        <label>Pre Instructions</label>
      </li>
      <li class="collection-item" *ngFor="let instruction of filterInstructions('PRE')">
        <p>{{ instruction?.description }}</p>
      </li>
    </ng-container>

    <li class="collection-item" >
      <p class="card-panel grey lighten-5 grey-text text-darken-1"
      [innerHtml]="insertParam(controlConstruct?.questionItemRef?.text)" style="font-style: italic"></p>
    </li>

    <li class="collection-item">
      <qddt-preview-responsedomain
        *ngIf="controlConstruct?.questionItemRef && controlConstruct.questionItemRef.element"
        [responseDomain]="controlConstruct.questionItemRef.element.responseDomainRef.element"
        [showLabel]="false"
        (selectedEvent)="onSelectedEvent($event)">
      </qddt-preview-responsedomain>
    </li>

    <ng-container *ngIf="filterInstructions('POST')?.length>0">
      <li class="collection-item" >
          <label>Post Instructions</label>
      </li>
      <li class="collection-item" *ngFor="let instruction of filterInstructions('POST')">
          <p>{{ instruction?.description }}</p>
      </li>
    </ng-container>

    <li class="collection-item" *ngIf="showDetail">
      <qddt-element-footer [element]="controlConstruct"></qddt-element-footer>
    </li>
</ul>
`,
})

export class PreviewQuestionConstructComponent implements OnChanges {
  @Input() controlConstruct: QuestionConstruct;
  @Input() inParameters: Map<string, Parameter>
  @Input() showDetail = true;
  @Output() selectedEvent = new EventEmitter<UserResponse[]>();

  public readonly filterInstructions = (rank: string) => this.controlConstruct.controlConstructInstructions
    .filter(f => f.instructionRank === rank)
    .map(ci => ci.instruction);

  constructor() { }

  public ngOnChanges(changes: SimpleChanges): void {
    if (hasChanges(changes.controlConstruct)) {
      this.assignValueToParameters(this.controlConstruct.parameterIn);
    }

    if (changes.inParameters && changes.inParameters.currentValue
      && this.controlConstruct && this.controlConstruct.parameterIn.length > 0) {
      this.assignValueToParameters(this.controlConstruct.parameterIn);
      console.log('question change')
    }
  }

  public onSelectedEvent(urs: UserResponse[]) {
    // console.log('onSelectedEvent');
    if (this.controlConstruct.parameterOut[0]) {
      this.controlConstruct.parameterOut[0].value = urs;
    } else {
      this.controlConstruct.parameterOut[0] = new Parameter({ id: uuid.v4(), name: this.controlConstruct.name, value: urs, parameterKind: 'OUT' });
    }
    this.selectedEvent.emit(urs);
  }


  private assignValueToParameters(inParameters: Parameter[]) {
    // console.log('assignValueToParameters');
    if ((!inParameters) || (!this.inParameters)) {
      return;
    }
    const reversed = [...this.inParameters.entries()].reverse();
    inParameters.forEach((p, i, refArray) => {
      if (!p.referencedId) {
        const found = reversed.find(o => o[1].name === p.name);
        if (found) {
          p.referencedId = found[1].id;
        }
      }
      if (p.referencedId) {
        console.log('fetch value by ref');
        p.value = this.inParameters.get(p.referencedId).value;
      }
      refArray[i] = p;
    });
  }


  public insertParam(text: string): string {
    if (this.controlConstruct && this.controlConstruct.parameterIn && this.inParameters) {
      this.controlConstruct.parameterIn.forEach(p => {
        let value = this.inParameters.get(p.referencedId).value;
        if (value) {
          text = text.replace(
            new RegExp('\\[' + p.name + '\\]', 'ig'), '<mark>' + value.map(pp => (pp.label) ? pp.label : pp.value).join(',') + '</mark>');
        }
      });
    }
    return text;

  }

}
