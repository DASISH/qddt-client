import { Condition, ConstructReferenceKind } from './../../lib/classes/controlconstruct.classes';
import { Component, Input, Output, EventEmitter, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';

import {
  ConditionConstruct,
  ElementKind,
  TemplateService,
  ActionKind,
  LANGUAGE_MAP,
  ConditionKind,
  toSelectItems,
  Loop,
  Parameter,
  IfThenElse,
} from 'src/app/lib';


@Component({
  selector: 'qddt-condition-form',
  templateUrl: './condition.form.component.html'
})

export class ConditionFormComponent implements AfterViewInit, OnChanges {
  @Input() condition: ConditionConstruct;
  @Input() readonly = false;
  @Output() modifiedEvent = new EventEmitter<ConditionConstruct>();

  public readonly formId = Math.round(Math.random() * 10000);
  public readonly CONDITION = ElementKind.CONDITION_CONSTRUCT;
  public readonly LANGUAGES = LANGUAGE_MAP;
  public readonly CONDITION_KIND_MAP = toSelectItems(ConditionKind);
  public foreach: boolean;

  constructor(private service: TemplateService) {
    this.readonly = !this.service.can(ActionKind.Create, ElementKind.CONDITION_CONSTRUCT);
    if (!this.condition) {
      this.condition = new ConditionConstruct({ xmlLang: 'none' });
    }
    console.log(this.CONDITION_KIND_MAP || JSON);
  }

  ngAfterViewInit(): void {
    M.updateTextFields();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.condition.currentValue) {
      this.doCheck();
    }
  }

  public doCheck(doit?: boolean) {

    if (doit || !this.condition.condition) {
      switch (this.condition.conditionKind) {
        case ConditionKind.IfThenElse:
          this.condition.condition = new IfThenElse({
            ifCondition: new Condition(),
            thenConstructReference: ConstructReferenceKind.NEXT_IN_SEQUENCE
          });
          break;
        case ConditionKind.ForI:
          if (this.isForEach(this.condition.condition)) {
            this.condition.condition = '{ "loopWhile": { "content": "HASNEXT" }, "controlConstructReference": "", "loopVariableReference" :"" }';
          } else {
            this.condition.condition = '{ "loopWhile": { "content": 10 }, "loopVariableReference": "", "initialValue": 0, "stepValue": 1 }';
          }
          break;
      }
      // this.condition.condition
    }

    if (typeof this.condition.condition === 'string') {
      console.log('is string');
      this.condition.condition = JSON.parse(this.condition.condition as string);
    }
  }


  public isForEach(element: any | Loop): element is Loop {
    return (element as Loop).controlConstructReference !== undefined;
  }

  public onSave() {
    this.condition.condition = JSON.stringify(this.condition.condition);
    this.service.update<ConditionConstruct>(this.condition).subscribe(
      (result) => {
        this.condition = new ConditionConstruct(result);
        this.modifiedEvent.emit(result);
      },
      (error) => { throw error; });
  }

  public getParam(param: Parameter, divider: string): string {
    return param.name + divider + ((param.value) ? param.value.map(p => '[' + p.value + ':' + p.label + ']').join(',') : '?');
  }

}
