import { Component, Input } from '@angular/core';
import { Concept } from '../../home/concept/concept.service';

@Component({
  selector: 'qddt-preview-concept-list',
  moduleId: module.id,
  styles: [
    '.col {white-space: nowrap; overflow: hidden; text-overflow: ellipsis;}',
    'collapsible-header { display: flow-root;  margin-left: unset;}'
  ],
  template: `
    <ul *ngIf="conceptList" materialize="collapsible" class="collapsible" data-collapsible="accordion" style="margin:25px; padding:10px;">
      <li *ngFor="let concept of conceptList">
        <div class="collapsible-header yellow lighten-5">
          <div class="col s2">Concept</div>
          <div class="col s7">{{ concept?.name }}</div>
          <div class="col s2 right-align"><qddt-version [element]="concept"></qddt-version></div>
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
