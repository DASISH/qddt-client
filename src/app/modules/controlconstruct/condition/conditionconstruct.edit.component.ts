import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ConditionConstruct, ElementKind, Page } from '../../../lib';
import { TemplateService } from '../../../components/template';

@Component({
  selector: 'qddt-condition-edit',

  templateUrl: 'conditionconstruct.edit.component.html',
  styles: [],
})

export class ConditionEditComponent implements OnInit {
  @Output() element = new EventEmitter<any>();
  condition: ConditionConstruct;
  elementId: string;
  elements: any[];
  elseConditionNum: number;

  public readonly CONDITION = ElementKind.CONDITION_CONSTRUCT;

  constructor(public service: TemplateService) {
    this.elements = [];
    this.elseConditionNum = 0;
  }

  ngOnInit() {
    this.condition = new ConditionConstruct();
    this.elementId = new Date().toString();
  }

  onSelectElement(e: any) {
  }

  onSelectElseElement(e: any, idx: number) {
  }

  onSearchElements(key: string) {
    this.service.searchByKind({ kind: this.CONDITION, key: key, page: new Page() })
      .then(
        (result) => { this.elements = result.content; },
        (error) => { throw error; });
  }

  onCreate() {
    // this.condition.condition = JSON.stringify(condition);
    this.service.update(this.condition)
      .subscribe(
        (result) => { this.element.emit(result); },
        (error) => { throw error; }
      );
    return false;
  }

  buildElseConditions() {
    // this.elseConditions = this.elseConditions.slice(0, this.elseConditionNum);
    // for (let i = this.elseConditions.length; i < this.elseConditionNum; i++) {
    //   const c: any = new ConditionCommand();
    //   this.elseConditions.push(c);
    // }
  }
}
