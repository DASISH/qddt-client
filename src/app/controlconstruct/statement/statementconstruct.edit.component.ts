import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ControlConstructService } from '../controlconstruct.service';
import { StatementConstruct } from '../controlconstruct.classes';


@Component({
  selector: 'qddt-statement-edit',
  moduleId: module.id,
  templateUrl: 'statementconstruct.edit.component.html',
  styles: [ ]
})
export class StatementEditComponent implements OnInit {
  @Output() element = new EventEmitter<any>();
  statement: StatementConstruct;
  elementId: string;

  constructor(private service: ControlConstructService) {
  }

  ngOnInit() {
    this.statement = new StatementConstruct();
  }

  onCreate() {
    this.service.updateStatement(this.statement)
      .subscribe(
        (result) => { this.element.emit(result); },
        (error) => { throw error; }
      );
    return false;
  }

}
