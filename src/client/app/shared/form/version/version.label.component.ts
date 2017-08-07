import { Component, Input } from '@angular/core';

@Component({
  selector: 'qddt-version-label',
  moduleId: module.id,
  template:
    `<label class="active teal-text text-align: right">Version <qddt-version [element]="element"></qddt-version>
    </label>`,
  providers: []
})
export class VersionLabelComponent  {
  @Input() element: any;

}
