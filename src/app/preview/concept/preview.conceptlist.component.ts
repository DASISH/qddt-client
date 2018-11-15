import { Component, Input } from '@angular/core';
import {Concept} from '../../classes';

@Component({
  selector: 'qddt-preview-concept-list',

  styles: [  ],
  template: `
    <ul class="col s11" *ngIf="conceptList" materialize="collapsible" class="collapsible" data-collapsible="accordion" >
      <li class="row" *ngFor="let concept of conceptList">
        <div class="collapsible-header yellow lighten-5"
          style="display: flow-root;  margin-left: unset; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; ">
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
