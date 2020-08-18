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
  <qddt-textarea class="col s9"
    required
    name="ifcondition"
    label="IfCondition"
    [(ngModel)]="element.ifCondition.content"
    data-length="100">
  </qddt-textarea>
  <qddt-select class="col s3"
    required
    name="thenconstructreference"
    label="ThenConstructReference"
    [(ngModel)]="element.thenConstructReference"
    [lockups]="CONDITION"
    >
  </qddt-select>
  <ng-container *ngFor="let item of element; index as idx">
  <qddt-textarea class="col s9"
    name="content-idx"
    label="ElseIf"
    [(ngModel)]="element[idx].ifCondition.content"
    data-length="100">
  </qddt-textarea>
  <qddt-select class="col s3"
    name="ref-idx"
    label="ElseConstructReference"
    [(ngModel)]="element[idx].thenConstructReference"
    [lockups]="CONDITION">
  </qddt-select>
  </ng-container>
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
