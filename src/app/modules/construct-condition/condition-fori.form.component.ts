import {
  AfterViewInit,
  Component,
  Input,
} from '@angular/core';
import { ConstructReferenceKind,  toSelectItems, Loop} from 'src/app/lib';


@Component({
  selector: 'qddt-for-i-form',
  template: `
<form *ngIf="element" id="CON-{{formId}}" [parentFormConnect]="formName" class="row>">
  <qddt-input-number class="col s3"
    required
    name="for"
    label="For [I]="
    [(ngModel)]="element.initialValue">
  </qddt-input-number>
  <qddt-input-number class="col s3" *ngIf="element.loopWhile.content"
    required
    name="to"
    label="until ≥"
    [(ngModel)]="element.loopWhile.content">
  </qddt-input-number>
  <qddt-input-number class="col s3"
    required
    name="step"
    placeholder="step by"
    label="step by"
    [(ngModel)]="element.stepValue">
  </qddt-input-number>
  <qddt-select class="col s3"
    name="loopvariablereference"
    label="Run this sequenceItem"
    [(ngModel)]="element.loopVariableReference"
    [lockups]="CONDITION">
  </qddt-select>
<span class="cl s6" >{{ element |json}}</span>
</form>
`,
})

export class ForIFormComponent implements AfterViewInit {
  @Input() element: Loop;
  @Input() formName: string;

  public readonly CONDITION = toSelectItems(ConstructReferenceKind);
  public readonly formId = Math.round( Math.random() * 10000);

  constructor() {
    if (!(this.element)) {
      this.element = new Loop({ initialValue: 1, loopWhile: { content: '10' }, stepValue: 1 });
    }

   }

  ngAfterViewInit(): void {
    if (!this.isLoop(this.element)) {
      this.element = new Loop({ initialValue: 1, loopWhile: { content: '10' }, stepValue: 1 });
    }
  }

  public isLoop(element: any | Loop): element is Loop {
    return (element as Loop).controlConstructReference !== undefined;
  }
}
