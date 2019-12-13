import { Component, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { StatementConstruct, ElementKind, TemplateService, ActionKind,  LANGUAGE_MAP} from 'src/app/lib';


@Component({
  selector: 'qddt-statement-form',
  templateUrl: './statement.form.component.html'
})

export class StatementFormComponent implements AfterViewInit {
  @Input() statement: StatementConstruct;
  @Input() readonly = false;
  @Output() modifiedEvent =  new EventEmitter<StatementConstruct>();

  public readonly formId = Math.round( Math.random() * 10000);
  public readonly STATEMENT = ElementKind.STATEMENT_CONSTRUCT;
  public readonly LANGUAGES = LANGUAGE_MAP;


  constructor(private service: TemplateService) {
    this.readonly = !this.service.can(ActionKind.Create, ElementKind.STATEMENT_CONSTRUCT);
    if (!this.statement) {
      this.statement = new StatementConstruct();
    }
  }


  ngAfterViewInit(): void {
    M.updateTextFields();
  }

  onSave() {
    this.service.update<StatementConstruct>(this.statement).subscribe(
      (result) => {
        this.statement = result;
        this.modifiedEvent.emit(result);
      },
      (error) => { throw error; });
  }

}
