import {
  AfterViewInit,
  Component,
  Input,
} from '@angular/core';
import { ConstructReferenceKind, IElementRef, IfThenElse, toSelectItems} from 'src/app/lib';


@Component({
  selector: 'qddt-if-then-else-form',
  template: `
<form id="CON-{{formId}}" [parentFormConnect]="formName" >
  <div class="row>">
    <qddt-input class="col s6"
      required
      name="ifcondition"
      label="IfCondition"
      [(ngModel)]="element.ifCondition"
      data-length="100">
    </qddt-input>
    <qddt-select class="col s6"
      required
      name="thenconstructreference"
      label="ThenConstructReference"
      [(ngModel)]="element.thenConstructReference"
      [lockups]="CONDITION"
      >
    </qddt-select>
  </div>
  <div class="row>">
    <qddt-input class="col s6"
      name="elseif"
      label="ElseIf"
      [(ngModel)]="element.elseIf"
      data-length="100">
    </qddt-input>
    <qddt-select class="col s6"
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
  public readonly formId = Math.round( Math.random() * 10000);

  constructor() {  }

  ngAfterViewInit(): void {
    if (!this.isIfThenElse(this.element)) {
      this.element = new IfThenElse();
    }
  }


  public isIfThenElse(element: any | IfThenElse): element is IElementRef {
    return (element as IfThenElse).thenConstructReference !== undefined;
  }
}
