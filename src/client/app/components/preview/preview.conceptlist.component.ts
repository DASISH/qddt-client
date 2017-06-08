import { Component, Input } from '@angular/core';

@Component({
  selector: 'qddt-preview-concept-list',
  moduleId: module.id,
  // styles: [
  //   '.collapsible { border:1px  }',
  // ],
  template: `
    <ul *ngIf="conceptList" materialize="collapsible" class="collapsible" data-collapsible="accordion" style="padding: 5pt;">
      <li *ngFor="let concept of conceptList">
        <div class="collapsible-header yellow lighten-5">
          <!--<div class="row">-->
            <div class="col s11">Concept: {{concept?.name}}</div>
            <div class="col s1">
              <label class="active">V{{concept?.version?.major}}.{{concept?.version?.minor}}</label>
            </div>
           <!--</div>-->
        </div>
        <div class="collapsible-body">
          <qddt-preview-concept [concept]="concept"></qddt-preview-concept>
        </div>
      </li>
    </ul>
  `,
  providers: [ ],
})

export class PreviewConceptListComponent {
  @Input() conceptList: any[];

}
