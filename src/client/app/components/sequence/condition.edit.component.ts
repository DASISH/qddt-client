import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ElementTypeDescription, SequenceService, Sequence, ConditionCommand } from './sequence.service';

@Component({
  selector: 'qddt-condition-edit',
  moduleId: module.id,
  template: `
    <div class="row teal-text">
      <h5>Condition</h5>
      <div class="input-field row">
        <label [attr.for]="elementId + '-name'">Name</label>
        <textarea id="{{elementId}}-name" name="{{elementId}}-name"
          class="materialize-textarea"
          [(ngModel)]="condition.name" [attr.maxlength]="255"
          required>
        </textarea>
      </div>
      <div class="input-field row">
        <label for="elseCondition_num" class="active">Number of elseConditions</label>
        <input id="elseCondition_num" name="elseCondition_num"
          type="number"
					(ngModelChange)="buildElseConditions()"
				  [(ngModel)]="elseConditionNum" required>
      </div>
      <div class="row card">
        <div class="input-field col s6">
        <label [attr.for]="elementId + '-ifCondition'">if Condition Command</label>
        <textarea id="{{elementId}}-ifCondition" name="{{elementId}}-ifCondition"
          class="materialize-textarea"
          [(ngModel)]="ifCondition.command" [attr.maxlength]="255">
        </textarea>
        </div>
        <div class="input-field col s6">
          <autocomplete
            [items]="elements"
            [elementtype]="QddtElementTypes[ElementKind.CONDITION_CONSTRUCT]"
            (autocompleteSelectEvent)="onSelectElement($event)"
				    (enterEvent)="onSearchElements($event)">
			    </autocomplete>
        </div>
      </div>
      <div class="row card" *ngFor="let condition of elseConditions; let idx=index;">
        <div class="input-field col s6">
        <label [attr.for]="elementId + '-elseCondition-' + idx">else Condition Command</label>
        <textarea id="{{elementId}}-elseCondition-{{idx}}"
          name="{{elementId}}-elseCondition-{{idx}}"
          class="materialize-textarea"
          [(ngModel)]="condition.command" [attr.maxlength]="255">
        </textarea>
        </div>
        <div class="input-field col s6">
          <autocomplete
            [items]="elements"
            [elementtype]="QddtElementTypes[ElementKind.CONDITION_CONSTRUCT]"
            (autocompleteSelectEvent)="onSelectElseElement($event, idx)"
				    (enterEvent)="onSearchElements($event)">
			    </autocomplete>
        </div>
      </div>
      <button
        (click)="onCreate()"
        class="btn btn-default green modal-action modal-close waves-effect">
        <a><i class="close material-icons medium white-text">create</i></a>
      </button>
    </div>`,
  styles: [
  ],
  providers: [ SequenceService ],
})

export class ConditionEditComponent implements OnInit {
  @Output() element: any = new EventEmitter<any>();
  condition: any;
  elementTypeDescription:any = ElementTypeDescription;
  elementId: string;
  ifCondition: any;
  elseConditions: any[];
  elements: any[];
  elseConditionNum: number;

  constructor(private service: SequenceService) {
    this.ifCondition = new ConditionCommand();
    this.elseConditions = [];
    this.elements = [];
    this.elseConditionNum = 0;
  }

  ngOnInit() {
    this.condition = new Sequence();
    this.condition.controlConstructKind = 'CONDITION_CONSTRUCT';
    this.elementId = new Date().toString();
  }

  onSelectElement(e: any) {
    this.ifCondition.constructId = e.id;
    this.ifCondition.type = 'QUESTION_CONSTRUCT';
    this.ifCondition.constructName = e.name;
  }

  onSelectElseElement(e: any, idx: number) {
    if(this.elseConditions.length <= idx) {
      return;
    }
    this.elseConditions[idx].constructId = e.id;
    this.elseConditions[idx].type = 'QUESTION_CONSTRUCT';
    this.elseConditions[idx].constructName = e.name;
  }

  onSearchElements(key: string) {
    this.service.getElements('QUESTION_CONSTRUCT', key)
      .subscribe((result: any) => {
        this.elements = result.content;
      }, (error: any) => null);
  }

  onCreate() {
    let condition = {'ifCondition': this.ifCondition, 'elseConditions': this.elseConditions};
    this.condition.condition = JSON.stringify(condition);
    this.service.create(this.condition)
      .subscribe((result: any) => {
        this.element.emit(result);
      }, (error: any) => null);
    return false;
  }

  buildElseConditions() {
    this.elseConditions = this.elseConditions.slice(0, this.elseConditionNum);
    for (let i = this.elseConditions.length; i < this.elseConditionNum; i++) {
      let c:any = new ConditionCommand();
      this.elseConditions.push(c);
    }
  }
}
