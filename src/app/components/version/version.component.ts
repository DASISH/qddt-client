import {Component, Input } from '@angular/core';
import {IEntityEditAudit, IVersion} from '../../lib/interfaces';
import {ElementRevisionRef} from '../../lib/classes';

@Component({
  selector: 'qddt-version',

  styles: [
     'i { margin:0px; vertical-align: middle;float: unset; display: unset; position: relative;  }'
  ],
  template: `
  {{version?.major}}.{{version?.minor}}
  <i *ngIf="element?.archived" class="material-icons blue-text tiny"
     title="Archived, (read only)">lock</i>
  <i *ngIf="version?.versionLabel=='In Development'" class="material-icons yellow-text text-darken-1 tiny "
    title="Latest changes, not saved as a version">error</i>
  <i *ngIf="version?.versionLabel=='Changes in hierarchy'" class="material-icons teal-text tiny "
    title="Hierarchy changes, not saved as a version">error</i>
`,
  providers: []
})
export class VersionComponent {
  @Input() element: IEntityEditAudit;
  @Input() revisionRef: ElementRevisionRef;

  public get version(): IVersion {
    if (this.element && this.element.version) {
      return  this.element.version;
    }
    if (this.revisionRef && this.revisionRef.version) {
      return this.revisionRef.version;
    }
    return {major: 0, minor: 0};
  }
}
