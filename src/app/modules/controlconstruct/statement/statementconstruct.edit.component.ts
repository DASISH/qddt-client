import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { StatementConstruct } from '../../../lib';
import { TemplateService } from '../../../components/template';


@Component({
  selector: 'qddt-statement-edit',

  templateUrl: 'statementconstruct.edit.component.html',
  styles: []
})
export class StatementEditComponent implements OnInit {
  @Output() element = new EventEmitter<any>();
  statement: StatementConstruct;
  elementId: string;

  constructor(private service: TemplateService) {
  }

  ngOnInit() {
    this.statement = new StatementConstruct();
  }

  onCreate() {
    this.service.update(this.statement)
      .subscribe(
        (result) => { this.element.emit(result); },
        (error) => { throw error; }
      );
    return false;
  }

}
