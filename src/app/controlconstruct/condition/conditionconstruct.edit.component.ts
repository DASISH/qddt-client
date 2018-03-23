import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ElementKind } from '../../preview/preview.service';
import { ConditionConstruct, ConditionCommand, ControlConstructService } from '../controlconstruct.service';

@Component({
  selector: 'qddt-condition-edit',
  moduleId: module.id,
  templateUrl: 'conditionconstruct.edit.component.html',
  styles: [],
})

export class ConditionEditComponent implements OnInit {
  @Output() element: any = new EventEmitter<any>();
  condition: ConditionConstruct;
  elementId: string;
  ifCondition: ConditionCommand;
  elseConditions: ConditionCommand[];
  elements: any[];
  elseConditionNum: number;

  constructor(public service: ControlConstructService) {
    this.ifCondition = new ConditionCommand();
    this.elseConditions = [];
    this.elements = [];
    this.elseConditionNum = 0;
  }

  ngOnInit() {
    this.condition = new ConditionConstruct();
    this.elementId = new Date().toString();
  }

  onSelectElement(e: any) {
    this.ifCondition.constructId = e.id;
    this.ifCondition.type = ElementKind.QUESTION_CONSTRUCT;
    this.ifCondition.constructName = e.name;
  }

  onSelectElseElement(e: any, idx: number) {
    if (this.elseConditions.length <= idx) {
      return;
    }
    this.elseConditions[idx].constructId = e.id;
    this.elseConditions[idx].type = ElementKind.QUESTION_CONSTRUCT;
    this.elseConditions[idx].constructName = e.name;
  }

  onSearchElements(key: string) {
    this.service.getElements(ElementKind.QUESTION_CONSTRUCT, key)
      .then(
        (result) => { this.elements = result.content; },
        (error) => { throw error; });
  }

  onCreate() {
    const condition = {'ifCondition': this.ifCondition, 'elseConditions': this.elseConditions};
    this.condition.condition = JSON.stringify(condition);
    this.service.createCondition(this.condition)
      .subscribe(
        (result) => { this.element.emit(result); },
        (error) => { throw error; }
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
