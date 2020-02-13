import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { StatementConstruct } from '../../../lib';

@Component({
  selector: 'qddt-preview-statementconstruct',

  template: `
      <h5>Statement</h5>
      <span class="row">{{ statement?.statement }}</span>
`,
  styles: [
  ],
  providers: [],
})

export class PreviewStatementConstructComponent {
  @Input() statement: StatementConstruct;
  @Input() showDetail = true;

}
