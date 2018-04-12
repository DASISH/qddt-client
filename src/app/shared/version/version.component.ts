import { Component, Input } from '@angular/core';
import { IEntityEditAudit } from '../classes/interfaces';

@Component({
  selector: 'qddt-version',
  moduleId: module.id,
  styles: [
     'i { margin:0px; vertical-align: middle;float: unset; display: unset; position: relative;  }'
  ],
  template:
  `{{element?.version?.major}}.{{element?.version?.minor}}
  <i *ngIf="element?.archived" class="material-icons blue-text tiny"
     title="Archived, (read only)">lock</i>
  <i *ngIf="element?.version?.versionLabel=='In Development'" class="material-icons yellow-text text-darken-1 tiny "
    title="Latest changes, not saved as a version">error</i>
  <i *ngIf="element?.version?.versionLabel=='Changes in hierarchy'" class="material-icons teal-text tiny "
    title="Hierarchy changes, not saved as a version">error</i>
  `,
  providers: []
})
export class VersionComponent  {
  @Input() element: IEntityEditAudit;

}
