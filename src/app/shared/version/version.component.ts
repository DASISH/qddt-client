import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'qddt-version',
  moduleId: module.id,
  template:
  `{{element?.version?.major}}.{{element?.version?.minor}}
  <i *ngIf="element?.archived" class="qddtIcon material-icons blue-text tiny"
     title="Archived, (read only)">lock</i>
  <i *ngIf="element?.version?.versionLabel=='In Development'" class="qddtIcon material-icons yellow-text text-darken-1 tiny "
    title="Latest changes, not saved as a version">error</i>
  <i *ngIf="element?.version?.versionLabel=='Changes in hierarchy'" class="qddtIcon material-icons teal-text tiny "
    title="Hierarchy changes, not saved as a version">error</i>
  `,
  providers: []
})
export class VersionComponent  {
  @Input() element: any;

}
