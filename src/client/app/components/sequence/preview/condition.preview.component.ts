import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'qddt-condition-preview',
  moduleId: module.id,
  template: `
    <div class="row">
      <h5>Condition</h5>
      <span class="row">{{condition}}</span>
    </div>`,
  styles: [
  ],
  providers: [ ],
})

export class ConditionPreviewComponent implements OnInit {
  @Input() condition: any;
  logic: any;

  ngOnInit() {
    this.condition = this.condition.condition || '';
  }

}
