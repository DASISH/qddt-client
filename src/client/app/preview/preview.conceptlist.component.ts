import { Component, Input } from '@angular/core';
import { Concept } from '../home/concept/concept.service';

@Component({
  selector: 'qddt-preview-concept-list',
  moduleId: module.id,
  // styles: [
  //   'ul .collapsible { margin:20px; padding:5px;}',
  // ],
  template: `
    <ul *ngIf="conceptList" materialize="collapsible" class="collapsible" data-collapsible="accordion" style="margin:25px; padding:10px;">
      <li *ngFor="let concept of conceptList">
        <div class="collapsible-header yellow lighten-5">
          <!--<div class="row">-->
            <div class="col l10">Concept: {{concept?.name}}</div>
            <div class="col l2">
              <qddt-version-label [element]="concept"></qddt-version-label>
              <!--<label class="active">V{{concept?.version?.major}}.{{concept?.version?.minor}}</label>-->
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
  @Input() conceptList: Concept[];

}
