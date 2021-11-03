import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { LocalDatePipe, ElementRevisionRef, hasChanges, IEntityEditAudit, MessageService, isString } from '../../lib';


@Component({
  selector: 'qddt-version-label',
  styles: [
    'label  { white-space: nowrap; vertical-align: middle; text-align: right; width: 90px; padding-left: 5px;}',
    'i { margin:0px; vertical-align: middle;float: unset; display: unset; position: relative; font-size:1rem;}'
  ],
  template:
    `<label class="teal-text" [title]="titleInfo">Version <qddt-version [element]="element" [revisionRef]="revisionRef" ></qddt-version>
    <i *ngIf="element?.basedOnObject" (click)="onClick()" class="material-icons teal-text tiny"
    style="cursor: pointer;" title="based on preview">content_copy</i>
    </label>`
  ,
  providers: [LocalDatePipe]
})
export class VersionLabelComponent implements OnChanges {
  @Input() element: IEntityEditAudit;
  @Input() revisionRef: ElementRevisionRef;

  public titleInfo = 'Last saved by: ?';

  constructor(private message: MessageService, private datePipe: LocalDatePipe) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (hasChanges(changes.element)) {
      let modifiedBy = this.element.modifiedBy || this.element._embedded.modifiedBy
      this.titleInfo = 'Last saved by: ' +
        (isString(modifiedBy) ?
          modifiedBy + ' : ' + (this.datePipe.transform(this.element.modified)) :
          modifiedBy.username + '@' + this.element._embedded.agency.name + ' : ' + (this.datePipe.transform(this.element.modified))
        );
    }
    if (hasChanges(changes.revisionRef)) {
      this.titleInfo = 'Last saved by:' +
        ((this.revisionRef.element && this.revisionRef.element.modifiedBy) ?
          this.revisionRef.element.modifiedBy.name + '@' + this.revisionRef.element.modifiedBy.agencyName + ' : ' + (this.datePipe.transform(this.revisionRef.element.modified)) :
          '?');
    }

  }


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

