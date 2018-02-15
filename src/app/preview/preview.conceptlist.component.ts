import { Component, Input } from '@angular/core';
import { Concept } from '../home/concept/concept.service';

@Component({
  selector: 'qddt-preview-concept-list',
  moduleId: module.id,
  styles: [
    '.col {white-space: nowrap; overflow: hidden; text-overflow: ellipsis;}'
  ],
  template: `
    <ul *ngIf="conceptList" materialize="collapsible" class="collapsible" data-collapsible="accordion" style="margin:25px; padding:10px;">
      <li *ngFor="let concept of conceptList">
        <div class="collapsible-header yellow lighten-5">
          <div class="row">
            <div class="col s9">Concept: {{concept?.name}} </div>
            <qddt-version-label  class="offset-s10 right" [element]="concept"></qddt-version-label>
           </div>
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
