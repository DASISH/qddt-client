import {
  Component,
  Input
} from '@angular/core';
import { ConstructReferenceKind, toSelectItems, Loop } from 'src/app/lib';


@Component({
  selector: 'qddt-for-each-form',
  styles: ['code {white-space: pre-wrap; }'],
  template: `
  <form id="CON-{{formId}}" [parentFormConnect]="formName" *ngIf="isLoop(element)" >
    <div class="row">
      <div class="col s12 card grey lighten-5 " >
        <div class="card-content grey-text text-darken-1" >
          <code>
              Foreach ({{element.loopVariableReference.name}}) do {{element.controlConstructReference}}
          </code>
        </div>
      </div>
    </div>
    <div class="hoverable row">
      <qddt-textarea class="col s8"
        required
        name="name"
        label="Foreach"
        [ngModel]="element.loopVariableReference.name"
        data-length="100"
        style="font-style: monospaced">
      </qddt-textarea>
      <qddt-select class="col s4"
        required
        name="controlConstructReference"
        label="Run this sequence"
        [(ngModel)]="element.controlConstructReference"
        [lockups]="CONDITION">
      </qddt-select>
    </div>
  </form>
`,
})

export class ForeachFormComponent {
  @Input() element: Loop;
  @Input() formName: string;

  public readonly CONDITION = toSelectItems(ConstructReferenceKind);
  public readonly formId = Math.round(Math.random() * 10000);


  constructor() { }

  public isLoop(element: any | Loop): element is Loop {
    return (element) && (element as Loop).loopWhile !== undefined;
  }

}
