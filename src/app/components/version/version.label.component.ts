import { element } from 'protractor';
import { Component, Input } from '@angular/core';
import { ElementRevisionRef, IEntityEditAudit, MessageService } from '../../lib';


@Component({
  selector: 'qddt-version-label',
  styles: [
    'label  { white-space: nowrap; vertical-align: middle; text-align: right; width: 90px; padding-left: 5px}',
    'i { margin:0px; vertical-align: middle;float: unset; display: unset; position: relative; }'
  ],
  template:
    `<label class="teal-text" [title]="getDocInfo()">Version <qddt-version [element]="element" [revisionRef]="revisionRef" ></qddt-version>
    <i *ngIf="element?.basedOnObject" (click)="onClick()" class="qddtIcon material-icons teal-text tiny"
    style="cursor: pointer;" title="based on preview">content_copy</i>
    </label>`
  ,
  providers: []
})
export class VersionLabelComponent {
  @Input() element: IEntityEditAudit;
  @Input() revisionRef: ElementRevisionRef;


  constructor(private message: MessageService) { }

  public readonly getDocInfo = () => (this.element) ?
    this.element.modifiedBy.name + '@' + this.element.agency.name + ' : ' + this.element.modified.toLocaleString() :
    "?"

  onClick() {
    if (this.element) {
      this.message.sendMessage({
        elementId: this.element.basedOnObject,
        elementRevision: this.element.basedOnRevision,
        elementKind: this.element.classKind
      });
    } else {
      this.message.sendMessage(this.revisionRef);
    }
  }

}
