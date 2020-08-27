import {
  Component,
  Input
} from '@angular/core';
import { ConstructReferenceKind, toSelectItems, Loop } from 'src/app/lib';


@Component({
  selector: 'qddt-for-each-form',
  template: `
  <form id="CON-{{formId}}" [parentFormConnect]="formName" *ngIf="isLoop(element)" >
  <div class="row">
    <ul class=" col s12 card-panel grey lighten-5 grey-text text-darken-1" >
      <li>
      <code>
          Foreach ({{element.loopWhile.content}}) do {{element.controlConstructReference}}
        </code>
      </li>
    </ul>
  </div>

    <ul>
      <li class="hoverable row">
        <qddt-textarea class="col s8"
          required
          name="loopWhile"
          label="Foreach"
          [(ngModel)]="element.loopWhile.content"
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
      </li>
    </ul>
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
