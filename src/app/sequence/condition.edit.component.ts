import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { SequenceService,  ConditionCommand, Condition } from './sequence.service';
import { ElementKind } from '../preview/preview.service';

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
          [(ngModel)]="ifCondition.command" [attr.maxlength]="255" >
        </textarea>
        </div>
        <div class="input-field col s6">
          <auto-complete
            [items]="elements"
            [elementtype]="service.getQddtElementFromStr('CONDITION_CONSTRUCT')"
            (autocompleteSelectEvent)="onSelectElement($event)"
				    (enterEvent)="onSearchElements($event)">
			    </auto-complete>
        </div>
      </div>
      <div class="row card" *ngFor="let condition of elseConditions; let idx=index;">
        <div class="input-field col s6">
        <label [attr.for]="elementId + '-elseCondition-' + idx">else Condition Command</label>
        <textarea id="{{elementId}}-elseCondition-{{idx}}"
          name="{{elementId}}-elseCondition-{{idx}}"
          class="materialize-textarea"
          [(ngModel)]="condition.command" [attr.maxlength]="255" >
        </textarea>
        </div>
        <div class="input-field col s6">
          <auto-complete
            [items]="elements"
            [elementtype]="service.getQddtElementFromStr('CONDITION_CONSTRUCT')"
            (autocompleteSelectEvent)="onSelectElseElement($event, idx)"
				    (enterEvent)="onSearchElements($event)">
			    </auto-complete>
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
})

export class ConditionEditComponent implements OnInit {
  @Output() element: any = new EventEmitter<any>();
  condition: Condition;
  elementId: string;
  ifCondition: ConditionCommand;
  elseConditions: ConditionCommand[];
  elements: any[];
  elseConditionNum: number;

  constructor(public service: SequenceService) {
    this.ifCondition = new ConditionCommand();
    this.elseConditions = [];
    this.elements = [];
    this.elseConditionNum = 0;
  }

  ngOnInit() {
    this.condition = new Condition();
    // this.condition.classKind = 'CONDITION_CONSTRUCT';
    this.elementId = new Date().toString();
  }

  onSelectElement(e: any) {
    this.ifCondition.constructId = e.id;
    this.ifCondition.type = 'QUESTION_CONSTRUCT';
    this.ifCondition.constructName = e.name;
  }

  onSelectElseElement(e: any, idx: number) {
    if (this.elseConditions.length <= idx) {
      return;
    }
    this.elseConditions[idx].constructId = e.id;
    this.elseConditions[idx].type = 'QUESTION_CONSTRUCT';
    this.elseConditions[idx].constructName = e.name;
  }

  onSearchElements(key: string) {
    this.service.getElements(ElementKind.QUESTION_CONSTRUCT, key)
      .then((result: any) => {
        this.elements = result.content;
      }, (error) => {
        throw error;
      });
  }

  onCreate() {
    const condition = {'ifCondition': this.ifCondition, 'elseConditions': this.elseConditions};
    this.condition.condition = JSON.stringify(condition);
    this.service.create(this.condition)
      .subscribe((result: any) => {
        this.element.emit(result);
      }, (error) => {
        throw error;
      }
    );
    return false;
  }

  buildElseConditions() {
    this.elseConditions = this.elseConditions.slice(0, this.elseConditionNum);
    for (let i = this.elseConditions.length; i < this.elseConditionNum; i++) {
      const c: any = new ConditionCommand();
      this.elseConditions.push(c);
    }
  }
}
