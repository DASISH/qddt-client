import {
  AfterViewInit,
  Component,
  Input,
} from '@angular/core';
import { ConstructReferenceKind, toSelectItems, Loop} from 'src/app/lib';


@Component({
  selector: 'qddt-for-each-form',
  template: `
<form id="CONF-{{formId}}" [parentFormConnect]="formName" *ngIf="element">
    <qddt-input class="col s6"
      required
      name="foreach"
      label="Foreach"
      [(ngModel)]="element.loopVariableReference"
      data-length="100">
    </qddt-input>
    <qddt-select class="col s6"
      required
      name="loopvariablereference"
      label="Run this sequence"
      [(ngModel)]="element.controlConstructReference"
      [lockups]="CONDITION">
    </qddt-select>
</form>
`,
})

export class ForeachFormComponent implements AfterViewInit {
  @Input() element: Loop;
  @Input() formName: string;

  public readonly CONDITION = toSelectItems(ConstructReferenceKind);
  public readonly formId = Math.round( Math.random() * 10000);

  constructor() {  }

  ngAfterViewInit(): void {
    if (!this.isLoop(this.element)) {
      console.log('loop inti')
      this.element = new Loop({loopVariableReference: null});
    }
  }

  public isLoop(element: any | Loop): element is Loop {
    return (element as Loop).controlConstructReference !== undefined;
  }

}
