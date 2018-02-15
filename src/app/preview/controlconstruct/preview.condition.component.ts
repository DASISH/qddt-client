import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'qddt-preview-conditionconstruct',
  moduleId: module.id,
  template: `
    <div class="row" *ngIf="condition">
      <h5>Condition</h5>
      <div class="row teal-text">
        <label [attr.for]="elementId + '-name'">Name</label>
        <textarea id="{{elementId}}-name" name="{{elementId}}-name"
          class="materialize-textarea"
          [ngModel]="condition.name"
          readonly>
        </textarea>
      </div>
      <div class="row card">
        <div class="col s6 teal-text">
        <label [attr.for]="elementId + '-ifCondition'">if Condition Command</label>
        <textarea id="{{elementId}}-ifCondition" name="{{elementId}}-ifCondition"
          class="materialize-textarea"
          [ngModel]="conditionjson.ifCondition.command"
          readonly>
        </textarea>
        </div>
        <div class="input-field col s6">
          <span>{{ conditionjson?.ifCondition?.constructName }}</span>
        </div>
      </div>
      <div class="row card" *ngFor="let condition of conditionjson.elseConditions; let idx=index;">
        <div class="col s6 teal-text">
        <label [attr.for]="elementId + '-elseCondition-' + idx">else Condition Command</label>
        <textarea id="{{elementId}}-elseCondition-{{idx}}"
          name="{{elementId}}-elseCondition-{{idx}}"
          [ngModel]="condition.command"
          class="materialize-textarea"
          readonly>
        </textarea>
        </div>
        <div class="input-field col s6">
          <span>{{ condition?.constructName }}</span>
        </div>
      </div>
    </div>`,
  styles: [
  ],
  providers: [ ],
})

export class PreviewConditionConstructComponent implements OnInit {
  @Input() condition: any;
  logic: any;
  elementId: string = new Date().toString();
  conditionstring: string;
  conditionjson: any;

  ngOnInit() {
    this.conditionstring = '{}';
    this.conditionjson = {};
    if (this.condition !== null && this.condition !== undefined) {
      this.conditionstring = this.condition.condition || '{}';
      this.conditionjson = JSON.parse(this.conditionstring);
    }
    if (this.conditionjson['ifCondition'] === null
      || this.conditionjson['ifCondition'] === undefined) {
      this.conditionjson['ifCondition'] = {};
    }
    if (this.conditionjson['elseConditions'] === null
      || this.conditionjson['elseConditions'] === undefined) {
      this.conditionjson['elseConditions'] = [];
    }
  }

}
