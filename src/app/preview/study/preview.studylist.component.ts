import { Component, Input } from '@angular/core';

@Component({
  selector: 'qddt-preview-study-list',
  moduleId: module.id,
  styles: [
    '.collapsible { border:1px  }',
  ],
  template: `
  <ul *ngIf="studyList" materialize="collapsible" class="collapsible" data-collapsible="accordion">
    <li *ngFor="let study of studyList">
      <div class="collapsible-header yellow lighten-5">
        <!--<div class="row">-->
          <div class="col s11">Study: {{ study?.name }}</div>
          <div class="col s1">
            <label class="active">V{{ study?.version?.major }}.{{ study?.version?.minor }}</label>
          </div>
        <!--</div>-->
      </div>
      <div class="collapsible-body">
        <qddt-preview-study [study]="study"></qddt-preview-study>
      </div>
    </li>
  </ul>
`,
  providers: [ ],
})

export class PreviewStudyListComponent {
  @Input() studyList: any[];

}
