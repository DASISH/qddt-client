import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { QuestionConstruct, Parameter, UserResponse } from '../../../lib';
import * as uuid from 'uuid';
@Component({
  selector: 'qddt-preview-questionconstruct',
  template: `
  <ul class="row" *ngIf="controlConstruct">
    <qddt-parameter [inParameters]="controlConstruct.inParameter" [outParameters]="controlConstruct.outParameter">
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

  public readonly filterInstructions = (rank: string) => this.controlConstruct.controlConstructInstructions
    .filter(f => f.instructionRank === rank)
    .map(ci => ci.instruction);

  constructor() { }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.controlConstruct && changes.controlConstruct.currentValue) {
      this.assignValueToParameters(this.controlConstruct.inParameter);
    }

    if (changes.inParameters && changes.inParameters.currentValue
      && this.controlConstruct && this.controlConstruct.inParameter.length > 0) {
      this.assignValueToParameters(this.controlConstruct.inParameter);
    }
  }

  public onSelectedEvent(urs: UserResponse[]) {
    if (this.controlConstruct.outParameter[0]) {
      this.controlConstruct.outParameter[0].value = urs;
    } else {
      this.controlConstruct.outParameter[0] = new Parameter({ id: uuid.v4(), name: this.controlConstruct.name, value: urs });
    }
  }


  private assignValueToParameters(inParameters: Parameter[]) {
    const reversed = [...this.inParameters.entries()].reverse();
    inParameters.forEach((p, i, refArray) => {
      if (!p.referencedId) {
        const found = reversed.find(o => o[1].name === p.name);
        if (found) {
          p.referencedId = found[1].id;
        }
      }
      if (p.referencedId) {
        p.value = this.inParameters.get(p.referencedId).value;
      }
      refArray[i] = p;
    });
  }

  public insertParam(text: string): string {
    if (this.controlConstruct && this.controlConstruct.inParameter) {
      this.controlConstruct.inParameter.forEach(p => {
        if (p.value) {
          text = text.replace(
            new RegExp('\\[' + p.name + '\\]', 'ig'), '<mark>' + p.value.map(pp => (pp.label) ? pp.label : pp.value).join(',') + '</mark>');
        }
      });
    }
    return text;

  }

}
