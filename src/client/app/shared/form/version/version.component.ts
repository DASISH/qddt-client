import { Component, Input } from '@angular/core';

@Component({
  selector: 'qddt-version',
  styles : [`i{
            width:0;
            }`
  ],
  moduleId: module.id,
  template:
  `{{element?.version?.major}}.{{element?.version?.minor}}
  <i *ngIf="element?.archived" class="material-icons blue-text tiny"
     title="Archived, (read only)">lock</i>
    <i *ngIf="element?.version?.versionLabel=='In Development'" class="material-icons yellow-text tiny"
    title="Latest changes, not saved as a version">error</i>
    <i *ngIf="element?.version?.versionLabel=='Changes in hierarchy'" class="material-icons orange-text tiny"
    title="Hierarchy changes, not saved as a version">error</i>`  ,
  providers: []
})
export class VersionComponent  {
  @Input() element: any;

}
