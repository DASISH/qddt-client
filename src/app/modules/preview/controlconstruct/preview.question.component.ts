import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { QuestionConstruct, Parameter, UserResponse } from '../../../lib';

@Component({
  selector: 'qddt-preview-questionconstruct',

  styles: [],
  template: `
  <ul class="row collection-item">
  <ng-container class="row" *ngIf="controlConstruct?.outParameter?.length>0 || controlConstruct?.inParameter?.length>0">
    <li class="collection-item">
      <label>Parameters</label>
    </li>
    <li class="collection-item chip" title="In parameter" *ngFor="let parameter of controlConstruct.inParameter">{{getParam(parameter)}} </li>
    <li class="collection-item chip" title="Out parameter" *ngFor="let parameter of controlConstruct.outParameter">{{getParam(parameter)}} </li>
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
    [innerHtml]="controlConstruct?.questionItemRef?.text" style="font-style: italic"></p>
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
  questionItem: any;

  constructor() { }

  public ngOnChanges(changes: SimpleChanges): void {
  }


  public getParam(param: Parameter): string {
    if (this.inParameters) {
      this.inParameters.forEach((p) => {
        let inp = this.controlConstruct.inParameter.find((ip) => ip.name.toUpperCase().includes(p.name));
        if (inp) {
          inp = p;
        }
      });
    }
    if (param.value) {

      // return param.name + '🢩' + (param.value) ? param.value.map(u => u.value + ':' + u.label).join(',') : '?';
      return param.name + '🢩' + (param.value[0].value || '?');
    } else {
      return param.name + '🢨' + (param.value[0].value || '?');
    }
  }

  public onSelectedEvent(urs: UserResponse[]) {
    this.controlConstruct.outParameter[0].name = this.controlConstruct.name;
    this.controlConstruct.outParameter[0].value = urs;
  }

}
