import { Component, Input, OnChanges } from '@angular/core';
import {Category, ResponseCardinality} from '../../../lib/classes';

@Component({
  selector: 'qddt-preview-rd-codelist',

  template: `
<div *ngIf="managedRepresentation">
  <ul>
    <li *ngFor="let row of rows" >
      <span class="left" style="width: 30px; float: right; "> {{ row.code }} </span>
      <label>
       <input name="option-select" type="{{type}}"
         [disabled]="row.disabled" (change)="checkOption(row, $event)"/>
        <span >{{row.label}}</span>
      </label>
    </li>
  </ul>
</div>
`,
})

export class ResponsedomainCodeListComponent implements OnChanges {
  @Input() managedRepresentation: Category;
  @Input() responseCardinality: ResponseCardinality;
  public rows: any[] = [];
  public type: string;

  ngOnChanges() {
    this.rows = [];
    const rep = this.managedRepresentation;

    for (const c of rep.children) {
      this.rows.push({ label: c.label, code: c.code.codeValue, checked: false });
    }

    this.type = (+this.responseCardinality.maximum > 1) ? 'checkbox' : 'radio';

  }

  checkOption(row: any, event: any) {
    row.checked = event.target.checked;
    if (this.type === 'checkbox') {
      if (this.rows.filter((e: any) => e.checked).length >= this.responseCardinality.maximum) {
        this.rows.filter((e: any) => !e.checked).forEach(e => e.disabled = 'disabled');
      } else {
        this.rows.forEach((e: any) => e.disabled = '');
      }
    }
  }
}
