import { Component, Input } from '@angular/core';
import { QddtMessageService } from '../../core/global/message.service';
import { IRevisionRef } from '../elementinterfaces/elements';
import { IEntityEditAudit } from '../elementinterfaces/entityaudit';

@Component({
  selector: 'qddt-version-label',
  moduleId: module.id,
  styles: [
    'label  { white-space: nowrap; vertical-align: middle; text-align: right; width: 90px;}',
    'i { margin:0px; vertical-align: middle;float: unset; display: unset; position: relative; }'
  ],
  template:
    `<label class="active teal-text">Version <qddt-version [element]="element"></qddt-version>
    <i *ngIf="element?.basedOnObject" (click)="onClick()" class="qddtIcon material-icons teal-text tiny"
    style="cursor: pointer;" title="based on preview">content_copy</i>
    </label>`
,
  providers: []
})
export class VersionLabelComponent  {
  @Input() element: IEntityEditAudit;


  constructor( private message: QddtMessageService) { }


  onClick() {
    const  ref: IRevisionRef =  {
      elementId: this.element.basedOnObject,
      elementRevision: this.element.basedOnRevision,
      elementKind: this.element.classKind };
    this.message.sendMessage( ref );
  }

}
