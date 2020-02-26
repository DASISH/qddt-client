import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ConditionConstruct } from '../../../lib';

@Component({
  selector: 'qddt-preview-conditionconstruct',

  template: `
    <ul  *ngIf="condition">
      <li class="collection-item">
        <label>Name</label>
        <p>{{condition.name }}</p>
      </li>
      <li class="collection-item">
        <label>ConditionKind</label>
        <p>{{condition.conditionKind }}</p>
      </li>
      <li class="collection-item card-panel">
        <label>Condition</label>
        <code [innerHtml]="condition.condition"> </code>
      </li>
  </ul>
  `,
  styles: [
  ],
  providers: [],
})

export class PreviewConditionConstructComponent implements OnChanges {
  @Input() condition: ConditionConstruct;
  @Input() showDetail = true;
  elementId: string = new Date().toString();


  ngOnChanges(changes: SimpleChanges): void {
    if (changes.condition) {
      this.condition = new ConditionConstruct(this.condition);
    }
  }

}
