import {
  AfterViewInit,
  Component,
  Input,
} from '@angular/core';
import { IfThenElse, TemplateService } from 'src/app/lib';


@Component({
  selector: 'qddt-if-then-else-form',
  template: `
<form id="CON-{{formId}}" class="hoverable row" [parentFormConnect]="formName">
  <qddt-input
    required
    name="IfCondition"
    label="IfCondition"
    [(ngModel)]="element.IfCondition"
    data-length="100">
  </qddt-input>
  <qddt-input
    required
    name="ThenConstructReference"
    label="ThenConstructReference"
    [(ngModel)]="element.ThenConstructReference"
    data-length="100">
  </qddt-input>
  <qddt-input
    required
    name="ElseIf"
    label="ElseIf"
    [(ngModel)]="element.ElseIf"
    data-length="100">
  </qddt-input>
  <qddt-input
    required
    name="ElseConstructReference"
    label="ElseConstructReference"
    [(ngModel)]="element.ElseConstructReference"
    data-length="100">
  </qddt-input>
</form>
`,
})

export class IfThenElseFormComponent implements AfterViewInit {
  @Input() element: IfThenElse;
  @Input() formName: string;

  public readonly formId = Math.round( Math.random() * 10000);

  constructor(private service: TemplateService) {  }

  ngAfterViewInit(): void {

  }
}
