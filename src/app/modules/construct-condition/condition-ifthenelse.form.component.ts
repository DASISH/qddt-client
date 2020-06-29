import {
  AfterViewInit,
  Component,
  Input,
} from '@angular/core';
import { ConstructReferenceKind, IElementRef, IfThenElse, toSelectItems } from 'src/app/lib';


@Component({
  selector: 'qddt-if-then-else-form',
  template: `
<form id="CON-{{formId}}" [parentFormConnect]="formName" *ngIf="isIfThenElse(element)">
  <div class="row>">
    <qddt-input class="col s3"
      required
      name="ifcondition"
      label="IfCondition"
      [(ngModel)]="element.ifCondition.content"
      data-length="100">
    </qddt-input>
    <qddt-select class="col s3"
      required
      name="thenconstructreference"
      label="ThenConstructReference"
      [(ngModel)]="element.thenConstructReference"
      [lockups]="CONDITION"
      >
    </qddt-select>
    <qddt-input class="col s3"
      name="elseif"
      label="ElseIf"
      [(ngModel)]="element.elseIf.content"
      data-length="100">
    </qddt-input>
    <qddt-select class="col s3"
      name="elseconstructreference"
      label="ElseConstructReference"
      [(ngModel)]="element.elseConstructReference"
      [lockups]="CONDITION">
    </qddt-select>
  </div>
</form>
`,
})

export class IfThenElseFormComponent implements AfterViewInit {
  @Input() element: IfThenElse;
  @Input() formName: string;

  public readonly CONDITION = toSelectItems(ConstructReferenceKind);
  public readonly formId = Math.round(Math.random() * 10000);

  constructor() { }

  ngAfterViewInit(): void {

  }


  public isIfThenElse(element: any | IfThenElse): element is IElementRef {
    return (element) && (element as IfThenElse).thenConstructReference !== undefined;
  }
}
