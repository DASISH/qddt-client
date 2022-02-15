import { Component, Input, Inject, LOCALE_ID } from '@angular/core';
import { IEntityEditAudit, IRevisionRef, MessageService } from '../../lib';
import { formatDate } from '@angular/common';

@Component({
  selector: 'qddt-element-footer',

  styleUrls: ['./style.css'],
  templateUrl: './elementfooter.component.html'
})
export class ElementFooterComponent {

  @Input() element: IEntityEditAudit;

  constructor(private message: MessageService, @Inject(LOCALE_ID) public localID: string) { }

  onClick() {

    const ref: IRevisionRef = {
      elementId: this.element.basedOn.id,
      elementRevision: this.element.basedOn.rev,
      elementKind: this.element.classKind
    };
    this.message.sendMessage(ref);
  }


  getTime(): string {
    console.debug(this.element);
    const m = this.element.modified;
    if (!m) { return '?'; }
    const date = new Date();
    date.setTime(m);
    console.debug(this.localID);
    return formatDate(date, 'longTime', this.fixNO_nb_nn(this.localID));
  }

  getVersion(): string {
    const v = this.element.version;
    if (!v) { return '?'; }
    const rev = (v.rev) ? '.' + v.rev : '';
    const label = (v.versionLabel) ? ' - ' + v.versionLabel : '';
    return v.major + '.' + v.minor + rev + label;
  }

  public fixNO_nb_nn(langcode: string): string {
    return langcode.toLowerCase().includes('no') ? 'nb' : langcode;
  }
}
