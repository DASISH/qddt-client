import { Component, Input } from '@angular/core';
import { Concept, getIcon } from '../../../lib';

@Component({
  selector: 'qddt-preview-concept-list',

  styles: [],
  template: `
<ng-container *ngIf="conceptList">
  <ul  class="collapsible" data-collapsible="accordion">
    <li *ngFor="let concept of conceptList; ">
      <div class="collapsible-header ">
        <i class="material-icons small teal-text text-lighten-3">{{getMatIcon(concept)}}</i>
        <div class="col s9 m10 grey-text text-darken-1" [innerHtml]=concept.name></div>
        <qddt-version-label class="col s3 m2 right-align" [element]="concept"></qddt-version-label>
      </div>
      <div class="collapsible-body">
        <qddt-preview-concept [concept]="concept"></qddt-preview-concept>
      </div>
    </li>
  </ul>
</ng-container>
  `,
  providers: [],
})

export class PreviewConceptListComponent {
  @Input() conceptList: Concept[];


  public getMatIcon(concept: Concept): string {
    return getIcon(concept.classKind);
  }
}
