import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'qddt-statement-preview',
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

export class StatementPreviewComponent implements OnInit {
  @Input() statement: any;
  text: string;

  ngOnInit() {
    this.text = this.statement.description || '';
  }

}
