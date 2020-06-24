import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { QuestionConstruct, Parameter, UserResponse } from '../../../lib';

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

    <ng-container *ngIf="controlConstruct?.preInstructions?.length>0">
      <li class="collection-item">
        <label>Pre Instructions</label>
      </li>
      <li class="collection-item" *ngFor="let instruction of controlConstruct.preInstructions">
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
        (selectedEvent)="onSelectedEvent($event)">
      </qddt-preview-responsedomain>
    </li>

    <ng-container *ngIf="controlConstruct?.postInstructions?.length>0">
      <li class="collection-item" >
          <label>Post Instructions</label>
      </li>
      <li class="collection-item" *ngFor="let instruction of controlConstruct?.postInstructions">
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
  @Input() inParameters: Map<number, Parameter>
  @Input() showDetail = true;

  constructor() { }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.inParameters && changes.inParameters.currentValue
      && this.controlConstruct && this.controlConstruct.inParameter.length > 0) {
      const params = [...this.inParameters.values()];

      this.controlConstruct.inParameter =
        this.controlConstruct.inParameter.map(obj => params.find(o => o.name === obj.name) || obj);
    }
  }


  public onSelectedEvent(urs: UserResponse[]) {
    this.controlConstruct.outParameter = [new Parameter({ name: this.controlConstruct.name, value: urs })];
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
