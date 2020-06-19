import { Component, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { Category, ResponseCardinality, UserResponse } from '../../../lib/classes';

@Component({
  selector: 'qddt-preview-rd-codelist',

  template: `
<div *ngIf="managedRepresentation">
  <ul>
    <li *ngFor="let row of rows; let idx = index" >
      <span class="left" style="width: 30px; float: right; "> {{ row.value }} </span>
      <label>
       <input  [id]="compId + idx"   name="option-select{{compId}}" type="{{type}}"
         [disabled]="row.disabled" (change)="checkOption(row, $event)"/>
        <span >{{row.label}}</span>
      </label>
    </li>
  </ul>
</div>
`,
})

export class ResponsedomainCodeListComponent implements OnChanges {
  @Output() selectedEvent = new EventEmitter<UserResponse[]>();
  @Input() managedRepresentation: Category;
  @Input() responseCardinality: ResponseCardinality;

  public compId = Math.round(Math.random() * 10000);
  public rows: UserResponse[] = [];
  public type: string;

  ngOnChanges() {
    this.rows = [];
    const rep = this.managedRepresentation;

    for (const c of rep.children) {
      const newLocal = { label: c.label, value: c.code.codeValue, checked: false } as UserResponse;
      this.rows.push(newLocal);
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
      this.selectedEvent.emit([...this.rows.filter(e => e.checked)
        .map((e: UserResponse) => {
          const newLocal = { label: e.label, value: e.value } as UserResponse;
          return newLocal;
        })]);
    }
    else
      this.selectedEvent.emit([{ label: row.label, value: row.value }]);
  }
}
