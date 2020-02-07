import { Component, Input } from '@angular/core';
import { Concept } from '../../../lib';

@Component({
  selector: 'qddt-preview-concept-list',

  styles: [],
  template: `
    <ul *ngIf="conceptList"  class="collapsible" data-collapsible="accordion" >
      <li class="row" *ngFor="let concept of conceptList">
        <div class="collapsible-header yellow lighten-5">
          <i class="material-icons small" title="Concept">looks_3</i>
          <div class="col s10">{{ concept?.name }}</div>
          <div class="col s2 right-align"><qddt-version [element]="concept"></qddt-version></div>
        </div>
        <div class="collapsible-body">
          <qddt-preview-concept [concept]="concept"></qddt-preview-concept>
        </div>
      </li>
    </ul>
  `,
  providers: [],
})

export class PreviewConceptListComponent {
  @Input() conceptList: Concept[];

}
