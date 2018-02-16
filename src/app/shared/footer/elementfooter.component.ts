import { Component, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'qddt-element-footer',
  moduleId: module.id,
  styles:  [
    'p {padding: 3px ;margin: inherit;!important;}',
    '.input-field label.active {padding-top:3px; !important;}'
  ],
  templateUrl: './elementfooter.component.html',
  providers: []
})
export class ElementFooterComponent {

  @Input() element: any;
  @Input() type: string;
  @Output() basedonObjectDetail: any = new EventEmitter<any>();
  basedon: any;

  constructor() {
    this.basedon = null;
  }

  onClick() {
    this.basedonObjectDetail.emit({id: this.element.basedOnObject, rev: this.element.basedOnRevision, type: this.type});
  }

  getTime(): string {
    const m = this.element.modified;
    if (!m) { return '?'; }
    const date = new Date(Date.UTC(parseInt(m[0]), parseInt(m[1]), parseInt(m[2]), parseInt(m[3]), parseInt(m[4]), parseInt(m[5])));
    return date.toISOString();
  }

  getVersion(): string {
    const v = this.element.version;
    if (!v) { return '?'; }
    const rev = (v.revision) ?  '.' + v.revision : '';
    const label = (v.versionLabel) ?  ' - ' + v.versionLabel : '';
    return v.major + '.' + v.minor + rev + label;
  }

}
