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
    <i *ngIf="element?.basedOn" (click)="onClick()" class="material-icons teal-text tiny"
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
      let modifiedBy = this.element.modifiedBy || this.element._embedded?.modifiedBy || this.element.userAgencyName || "?"
      this.titleInfo = 'Last saved by: ' +
        (isString(modifiedBy) ?
          modifiedBy + ' : ' + (this.datePipe.transform(this.element.modified)) :
          modifiedBy.userAgencyName + ' : ' + (this.datePipe.transform(this.element.modified))
        );
    }
    if (hasChanges(changes.revisionRef)) {
      let element = this.revisionRef.element
      this.titleInfo = 'Last saved by:' +
        ((element && element._embedded?.modifiedBy) ?
          element._embedded?.modifiedBy.userAgencyName + ' : ' + (this.datePipe.transform(element.modified)) :
          '?');
    }

  }


  onClick() {
    if (this.element) {
      this.message.sendMessage({
        elementId: this.element.basedOn.id,
        elementRevision: this.element.basedOn.rev,
        elementKind: this.element.classKind
      });
    } else {
      this.message.sendMessage(this.revisionRef);
    }
  }
}

