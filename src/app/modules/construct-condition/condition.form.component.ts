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
  isString,
  isCondition,
  isConRef,
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
  }

  ngAfterViewInit(): void {
    M.updateTextFields();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.condition.currentValue) {
      this.condition = new ConditionConstruct(this.condition);
    }

  }

  public doCheck(doit?: boolean) {
    switch (this.condition.conditionKind) {
      case ConditionKind.IfThenElse:
        this.condition.condition = new IfThenElse((doit) ? JSON.parse(this.condition.condition) : '{}');
        break;
      case ConditionKind.Loop:
        this.condition.condition = new Loop((doit) ? JSON.parse(this.condition.condition) : '{}');
        break;
      default:
        console.log(this.condition.conditionKind);
    }
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
