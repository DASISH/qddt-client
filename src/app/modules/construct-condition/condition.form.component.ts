import { Component, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { ConditionConstruct, ElementKind, TemplateService, ActionKind,  LANGUAGE_MAP, ConditionKind} from 'src/app/lib';
import { toSelectItems } from '../../lib/consts/functions';


@Component({
  selector: 'qddt-condition-form',
  templateUrl: './condition.form.component.html'
})

export class ConditionFormComponent implements AfterViewInit {
  @Input() condition: ConditionConstruct;
  @Input() readonly = false;
  @Output() modifiedEvent =  new EventEmitter<ConditionConstruct>();

  public readonly formId = Math.round( Math.random() * 10000);
  public readonly CONDITION = ElementKind.CONDITION_CONSTRUCT;
  public readonly LANGUAGES = LANGUAGE_MAP;
  public readonly CONDITION_KIND_MAP = toSelectItems(ConditionKind);


  constructor(private service: TemplateService) {
    this.readonly = !this.service.can(ActionKind.Create, ElementKind.CONDITION_CONSTRUCT);
    if (!this.condition) {
      this.condition = new ConditionConstruct();
    }
  }


  ngAfterViewInit(): void {
    M.updateTextFields();
  }

  onSave() {
    this.service.update<ConditionConstruct>(this.condition).subscribe(
      (result) => {
        this.condition = result;
        this.modifiedEvent.emit(result);
      },
      (error) => { throw error; });
  }

}
