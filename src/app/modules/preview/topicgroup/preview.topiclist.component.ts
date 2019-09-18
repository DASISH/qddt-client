import { Component, Input } from '@angular/core';

@Component({
  selector: 'qddt-preview-topic-list',

  styles: [
    '.collapsible { border:1px  }',
  ],
  template: `
  <ul *ngIf="topicList" materialize="collapsible" class="collapsible" data-collapsible="accordion">
    <li *ngFor="let topic of topicList">
      <div class="collapsible-header yellow lighten-5">
        <!--<div class="row">-->
          <div class="col s11">Module: {{ topic?.name }}</div>
          <div class="col s1">
            <label class="active">V{{ topic?.version?.major }}.{{ topic?.version?.minor }}</label>
          </div>
        <!--</div>-->
      </div>
      <div class="collapsible-body">
        <qddt-preview-topic [topic]="topic"></qddt-preview-topic>
      </div>
    </li>
  </ul>
`,
  providers: [ ],
})

export class PreviewTopicListComponent {
  @Input() topicList: any[];

}
