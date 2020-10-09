import { Component, Input, } from '@angular/core';
import { ConstructReferenceKind, IElementRef, IfThenElse, toSelectItems, Condition } from 'src/app/lib';


@Component({
  selector: 'qddt-if-then-else-form',
  styles: ['code {white-space: pre-wrap; color:blue; }'],
  template: `
<form  class="col s12" id="CON-{{formId}}" [parentFormConnect]="formName" *ngIf="isIfThenElse(element)">
<ul class="col s12">
    <li class="collection-item row">
      <qddt-input-number class="col s3"
        required
        name="count"
        label="Number of ElseIf"
        min="0"
        [ngModel]="element.elseIf.length"
        (change)="doElseIf($event.target.value)">
      </qddt-input-number>
    </li>
  <!-- <div class="row"> -->
    <li class="collection-item row">
    <div class="card grey lighten-5 " >
      <div class="card-content grey-text text-darken-1" >
        <code>IF ( {{element.ifCondition.content}} ) THEN {{"\n"}} GOTO {{element.thenConstructReference}}
        </code>
        <ng-container *ngFor="let item of element.elseIf">
          <code>
          {{"\n"}}ELSE IF ( {{item.ifCondition.content}} ) THEN {{"\n"}}
          GOTO {{item.thenConstructReference}}
          </code>
        </ng-container>
      </div>
    </div>
    </li>
  <!-- </div> -->
    <li [id]="'CC-LI-0'" class="hoverable row">
      <qddt-textarea class="col s9"
        required
        name="content"
        label="If"
        [(ngModel)]="element.ifCondition.content"
        data-length="100">
      </qddt-textarea>
      <qddt-select class="col s3"
        required
        name="thenconstructreference"
        label="Then Reference"
        [(ngModel)]="element.thenConstructReference"
        (ngModelChange)="onItemNew($event)"
        [lockups]="CONDITION">
      </qddt-select>
    </li>
    <li [id]="'CC-LI-'+idx" class="hoverable row" *ngFor="let elseIf of element.elseIf; let idx=index;">
      <qddt-textarea class="col s9"
          required
          [name]="'content-'+idx"
          label="Else If"
          [(ngModel)]="elseIf.ifCondition.content"
          data-length="100" >
        </qddt-textarea>
        <qddt-select class="col s3"
          required
          [name]="'thenconstructreference-'+idx"
          label="Then Reference"
          [(ngModel)]="elseIf.thenConstructReference"
          [lockups]="CONDITION">
        </qddt-select>
    </li>
  </ul>
</form>
`,
})

export class IfThenElseFormComponent {
  @Input() element: IfThenElse;
  @Input() formName: string;

  public readonly CONDITION = toSelectItems(ConstructReferenceKind);
  public readonly formId = Math.round(Math.random() * 10000);

  constructor() { }



  public isIfThenElse(element: any | IfThenElse): element is IElementRef {
    return (element) && (element as IfThenElse).ifCondition !== undefined;
  }

  public doElseIf(num) {
    const count = this.element.elseIf.length;
    if (count === num) {
      return;
    }
    if (count > num) {
      this.element.elseIf = this.element.elseIf.slice(0, num);
    } else if (count < num) {
      for (let i = count; i < num; i++) {
        this.element.elseIf.push({ ifCondition: new Condition(), thenConstructReference: ConstructReferenceKind.NEXT_IN_LINE });
      }
    } else if (num < 0) {
      num = 0;
      this.element.elseIf.length = 0;
    }
  }

  public onItemNew(event) {
    console.log(event);
  }
}
