import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {ConditionConstruct} from '../../classes';

@Component({
  selector: 'qddt-preview-conditionconstruct',

  template: `
    <div class="row" *ngIf="condition">
      <h5>Condition</h5>
      <div class="row input-field">
        <input name="{{elementId}}-name" [ngModel]="condition.name" readonly>
        <label >Name</label>
      </div>
      <div class="row input-field">
        <input name="{{elementId}}-conditionKind" [ngModel]="condition.conditionKind" readonly>
        <label >conditionKind</label>
      </div>
      <div class="row card">
        <p> {{ conditionT | json }} </p>
      </div>
    </div>`,
  styles: [
  ],
  providers: [ ],
})

export class PreviewConditionConstructComponent implements OnChanges {
  @Input() condition: ConditionConstruct;
  @Input() showDetail = true;
  elementId: string = new Date().toString();

  get  conditionT() {
    return this.condition.conditionT;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.condition) {
      this.condition = new ConditionConstruct(this.condition);
    }
  }

}
