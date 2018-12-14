import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {ConditionConstruct} from '../../classes';

@Component({
  selector: 'qddt-preview-conditionconstruct',

  template: `
    <div class="row" *ngIf="condition">
      <h5>Condition</h5>
      <div class="row">
        <label>Name</label>
      </div>
      <div class="row">
        {{condition.name}}
      </div>
      <div class="row">
        <label>conditionKind</label>
      </div>
      <div class="row">
        {{condition.conditionKind}}
      </div>
      <!--<div class="row input-field">-->
        <!--&lt;!&ndash;<input name="{{elementId}}-name" [ngModel]="condition.name" readonly>&ndash;&gt;-->
        <!--<label>Name</label>-->
        <!--{{condition.name}}-->
      <!--</div>-->
      <!--<div class="row input-field">-->
        <!--&lt;!&ndash;<input name="{{elementId}}-conditionKind" [ngModel]="condition.conditionKind" readonly>&ndash;&gt;-->
        <!--<label>conditionKind</label>-->
        <!--{{condition.conditionKind}}-->
      <!--</div>-->
      <div class="row">
        <label>Condition</label>
      </div>
      <div class="row card">
        <p> {{ condition.condition | json }} </p>
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


  ngOnChanges(changes: SimpleChanges): void {
    if (changes.condition) {
      this.condition = new ConditionConstruct(this.condition);
    }
  }

}
