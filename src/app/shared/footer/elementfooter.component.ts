import { Component, Input } from '@angular/core';
import { IRevisionRef } from '../../preview/preview.service';
import { QddtMessageService } from '../../core/global/message.service';

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

  constructor( private message: QddtMessageService) { }

  onClick() {
    const  ref: IRevisionRef =  {
      id: this.element.basedOnObject,
      revisionNumber: this.element.basedOnRevision,
      elementKind: this.element.classKind };
    this.message.sendMessage( ref );
  }


  getTime(): string {
    const m = this.element.modified;
    if (!m) { return '?'; }
    const date = new Date();
    date.setTime(parseInt(m));
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
