import { Component, OnInit, Input } from '@angular/core';
import { StatementConstruct } from '../../controlconstruct/controlconstruct.classes';

@Component({
  selector: 'qddt-preview-statementconstruct',

  template: `
    <div class="row">
      <h5>Statement</h5>
      <span class="row">{{ text }}</span>
    </div>`,
  styles: [
  ],
  providers: [ ],
})

export class PreviewStatementConstructComponent implements OnInit {
  @Input() statement: StatementConstruct;
  @Input() showDetail = true;
  text: string;

  ngOnInit() {
    this.text = this.statement.statement || '';
  }

}
