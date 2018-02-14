import { Component, Input } from '@angular/core';

@Component({
  selector: 'qddt-version-label',
  moduleId: module.id,
  styles: [ 'label  { white-space: nowrap; vertical-align: middle; text-align: right}'],
  template:
    `<label class="active teal-text">Version <qddt-version [element]="element"></qddt-version>
    </label>`,
  providers: []
})
export class VersionLabelComponent  {
  @Input() element: any;

}
