import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'qddt-preview-statement',
  moduleId: module.id,
  template: `
    <div class="row">
      <h5>Statement</h5>
      <span class="row">{{text}}</span>
    </div>`,
  styles: [
  ],
  providers: [ ],
})

export class PreviewStatementConstructComponent implements OnInit {
  @Input() statement: any;
  text: string;

  ngOnInit() {
    this.text = '';
    if(this.statement !== null && this.statement !== undefined) {
      this.text = this.statement.description || '';
    }
  }

}
