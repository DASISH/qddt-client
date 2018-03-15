import { Component, Input, Output, EventEmitter } from '@angular/core';
import { QddtMessageService } from '../../core/global/message.service';
import { IElementRef, IRevisionRef } from '../../preview/preview.service';

@Component({
  selector: 'qddt-version-label',
  moduleId: module.id,
  styles: [ 'label  { white-space: nowrap; vertical-align: middle; text-align: right; width: 90px;}'],
  template:
    `<label class="active teal-text">Version <qddt-version [element]="element"></qddt-version>
    <i *ngIf="element?.basedOnObject" (click)="onClick()" class="qddtIcon material-icons teal-text tiny"
    style="cursor: pointer;" title="based on preview">content_copy</i>
    </label>`
,
  providers: []
})
export class VersionLabelComponent  {
  @Input() element: any;


  constructor( private message: QddtMessageService) { }


  onClick() {
    const  ref: IRevisionRef =  { id: this.element.basedOnObject,
       revisionNumber: this.element.basedOnRevision,
       elementKind: this.element.classKind };
    this.message.sendMessage( ref );
  }

}
