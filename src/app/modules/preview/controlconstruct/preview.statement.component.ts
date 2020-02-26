import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { StatementConstruct } from '../../../lib';

@Component({
  selector: 'qddt-preview-statementconstruct',

  template: `
      <p>{{ statement?.statement }}</p>
`,
  styles: [
  ],
  providers: [],
})

export class PreviewStatementConstructComponent {
  @Input() statement: StatementConstruct;
  @Input() showDetail = true;

}
