import { KeyValue } from '@angular/common';
import {
  AfterViewInit,
  Component,
  Input,
} from '@angular/core';
import { ConstructReferenceKind, IElementRef, IfThenElse, toSelectItems, IIfThenElse, Condition } from 'src/app/lib';


@Component({
  selector: 'qddt-if-then-else-form',
  template: `
<form id="CON-{{formId}}" [parentFormConnect]="formName" *ngIf="isIfThenElse(element)">
  <qddt-input-number class="col s3"
    required
    name="count"
    label="Number of ElseIf"
    (change)="doElseIf($event.target.value)">
  </qddt-input-number>
  <!-- <qddt-input class="col s2" type="number" name="count" (change)="doElseIf($event.target.value)"> -->
  <ul class="col s12">
    <li >
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
        [lockups]="CONDITION">
      </qddt-select>
  </li>
  <li *ngFor="let item of  element.elseIf | keyvalue">
    <qddt-textarea class="col s9"
        required
        name="ifcondition"
        label="IfCondition"
        [(ngModel)]="item.value.ifCondition.content"
        data-length="100">
      </qddt-textarea>
      <qddt-select class="col s3"
        required
        name="thenconstructreference"
        label="ThenConstructReference"
        [(ngModel)]="item.value.thenConstructReference"
        [lockups]="CONDITION">
      </qddt-select>
  </li>
  <!-- <qddt-textarea class="col s9"
    name="content-idx"
    label="ElseIf"
    [(ngModel)]="entry.value.ifCondition.content"
    data-length="100">
  </qddt-textarea>
  <qddt-select class="col s3"
    name="ref-idx"
    label="ElseConstructReference"
    [(ngModel)]="entry.value.thenConstructReference"
    [lockups]="CONDITION">
  </qddt-select> -->
  </ul>
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
    return (element) && (element as IfThenElse).ifCondition !== undefined;
  }

  public propsToArray(obj: { [index: string]: IIfThenElse; } | { [index: number]: IIfThenElse; }) {
    return Object.keys(obj).map(prop => obj[prop]);
  }

  public doElseIf(event) {
    this.element.elseIf[event] = { ifCondition: new Condition(), thenConstructReference: ConstructReferenceKind.NEXT_IN_LINE }
  }
}
