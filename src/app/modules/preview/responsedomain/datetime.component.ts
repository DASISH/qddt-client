import { Component, Input, OnChanges, SimpleChanges, Output, EventEmitter, Inject, LOCALE_ID } from '@angular/core';
import { getLocaleMonthNames, getLocaleDayNames, formatDate } from '@angular/common';
import { delay, DATE_FORMAT_MAP, hasChanges, Category, UserResponse } from '../../../lib';

@Component({
  selector: 'qddt-preview-rd-datetime',

  template: `
<ng-container *ngIf="managedRepresentation">
  <div class="input-field">
    <div style="color:rgb(200, 200, 200); position: Absolute ; top: 1rem; right:0; z-index: 1;" >[ {{managedRepresentation.format}} ]</div>
    <ng-container *ngIf="managedRepresentation.format" >
      <input *ngIf="managedRepresentation.format.startsWith('PTn')" [id]="identifier" type="time" min="26:00" max="00:00" >
      <input *ngIf="!managedRepresentation.format.startsWith('PTn')" [id]="identifier" type="text" class="datepicker">
      <label [for]="identifier" >{{managedRepresentation.label}}</label>
      <span>Range  {{ managedRepresentation.inputLimit.minimum }} - {{ managedRepresentation.inputLimit.maximum }}</span>
    </ng-container>
  </div>
</ng-container>
`,
  styles: [],
})

export class ResponsedomainDatetimeComponent implements OnChanges {
  @Output() selectedEvent = new EventEmitter<UserResponse[]>();
  @Input() managedRepresentation: Category;

  public readonly DATE_FORMATS = DATE_FORMAT_MAP;
  public identifier;

  constructor(@Inject(LOCALE_ID) protected localID: string) {
    this.identifier = 'DATE-' + ident++;
  }


  ngOnChanges(changes: SimpleChanges): void {
    if (hasChanges(changes.managedRepresentation)) {
      delay(20).then(() => {
        this.initDate(this.managedRepresentation);
      });
    }
  }


  onSelect(value: Date) {
    const format = this.DATE_FORMATS.find(p => p.value === this.managedRepresentation.format).description;
    const dateString = formatDate(value, format, this.managedRepresentation.xmlLang);
    this.selectedEvent.emit([{
      label: this.managedRepresentation.label,
      value: dateString
    }]);
  }

  private initDate(rep: Category) {

    const elems = document.querySelectorAll('.datepicker')
    if (elems) {
      // @ts-ignore
      M.Datepicker.init(elems, {
        format: rep.format,
        autoClose: true,
        yearRange: [rep.inputLimit.minimum, rep.inputLimit.maximum],
        i18n: {
          months: getLocaleMonthNames(rep.xmlLang, 1, 2),
          monthsShort: getLocaleMonthNames(rep.xmlLang, 1, 1),
          weekdays: getLocaleDayNames(rep.xmlLang, 1, 2),
          weekdaysShort: getLocaleDayNames(rep.xmlLang, 1, 1)
        },
        onSelect: (date) => this.onSelect(date)
      });
    } else {
      const elems = document.querySelectorAll('.timepicker');
      M.Timepicker.init(elems, {
        twelveHour: false,
        autoClose: true,

      });
    }

  }

}

let ident = 0;
