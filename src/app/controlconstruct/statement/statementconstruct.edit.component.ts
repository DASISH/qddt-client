import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ControlConstructService, StatementConstruct } from '../controlconstruct.service';


@Component({
  selector: 'qddt-statement-edit',
  moduleId: module.id,
  templateUrl: 'statementconstruct.edit.component.html',
  styles: [ ]
})
export class StatementEditComponent implements OnInit {
  @Output() element: any = new EventEmitter<any>();
  statement: StatementConstruct;
  elementId: string;

  constructor(private service: ControlConstructService) {
  }

  ngOnInit() {
    this.statement = new StatementConstruct();
    this.elementId = new Date().toString();
  }

  onCreate() {
    this.service.createStatement(this.statement)
      .subscribe(
        (result) => { this.element.emit(result); },
        (error) => { throw error; }
      );
    return false;
  }

}
