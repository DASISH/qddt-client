import { Component, Input } from '@angular/core';
import {IEntityEditAudit, IRevisionRef, MessageService, SessionService} from '../../lib';
import {formatDate} from '@angular/common';

@Component({
  selector: 'qddt-element-footer',

  styleUrls: [ './style.css'],
  // styles:  [
  //   ' .chip {margin-top: 5px;}',
  // ],
  templateUrl: './elementfooter.component.html'
})
export class ElementFooterComponent {

  @Input() element: IEntityEditAudit;

  constructor( private message: MessageService, public session: SessionService) { }

  onClick() {
    const  ref: IRevisionRef =  {
      elementId: this.element.basedOnObject,
      elementRevision: this.element.basedOnRevision,
      elementKind: this.element.classKind };
    this.message.sendMessage( ref );
  }


  getTime(): string {
    const m = this.element.modified;
    if (!m) { return '?'; }
    const date = new Date();
    date.setTime(m);
    // console.info(this.session.locale);
    return formatDate(date, 'longTime', this.session.locale);
    // return date.toLocaleString(this.session.locale);
  }

  getVersion(): string {
    const v = this.element.version;
    if (!v) { return '?'; }
    const rev = (v.revision) ?  '.' + v.revision : '';
    const label = (v.versionLabel) ?  ' - ' + v.versionLabel : '';
    return v.major + '.' + v.minor + rev + label;
  }

}
