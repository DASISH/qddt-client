import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { QuestionConstruct, Parameter, UserResponse } from '../../../lib';

@Component({
  selector: 'qddt-preview-questionconstruct',

  styles: [],
  template: `
  <ul class="row">
    <ng-container class="row" *ngIf="controlConstruct?.outParameter?.length>0 || controlConstruct?.inParameter?.length>0">
      <li class="collection-item">
        <label>Parameters</label>
      </li>
      <li class="chip" title="In parameter" *ngFor="let parameter of controlConstruct.inParameter">{{getParam(parameter,'🢩')}} </li>
      <li class="chip" title="Out parameter" *ngFor="let parameter of controlConstruct.outParameter">{{getParam(parameter, '🢨')}} </li>
    </ng-container>

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
  @Input() inParameters: Parameter[];
  @Input() showDetail = true;

  constructor() { }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.inParameters && changes.inParameters.currentValue
      && this.controlConstruct && this.controlConstruct.inParameter.length > 0) {
      this.controlConstruct.inParameter =
        this.controlConstruct.inParameter.map(obj => this.inParameters.find(o => o.name === obj.name) || obj);
    }
    if (changes.controlConstruct && changes.controlConstruct.currentValue) {
      M.updateTextFields();
    }
  }


  public getParam(param: Parameter, divider: string): string {
    return param.name + divider + ((param.value) ? param.value.map(p => '[' + p.value + ':' + p.label + ']').join(',') : '?');
  }

  public onSelectedEvent(urs: UserResponse[]) {
    this.controlConstruct.outParameter = [new Parameter({ name: this.controlConstruct.name, value: urs })];
  }

  public insertParam(text: string): string {
    if (this.controlConstruct && this.controlConstruct.inParameter) {
      this.controlConstruct.inParameter.forEach(p => {
        if (p.value) {
          text = text.replace(new RegExp('\\[' + p.name + '\\]', 'ig'), '<mark>' + p.value.map(pp => pp.label).join(',') + '</mark>');
        }
      });
    }
    return text;

  }

}
