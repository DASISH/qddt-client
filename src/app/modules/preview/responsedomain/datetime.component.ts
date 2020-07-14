import { Component, Input, OnChanges, OnInit, SimpleChanges, Output, EventEmitter, Inject, LOCALE_ID } from '@angular/core';
import { Category, UserResponse } from '../../../lib/classes';
import { DatepickerOptions } from 'materialize-css';
import { getLocaleDateFormat, getLocaleMonthNames, getLocaleDayNames } from '@angular/common';
import { delay } from 'src/app/lib';

@Component({
  selector: 'qddt-preview-rd-datetime',

  template: `
<ng-container *ngIf="managedRepresentation">
  <div class="input-field">
    <div style="color:rgb(200, 200, 200); position: Absolute ; top: 1rem; right:0; z-index: 1;" >[ {{managedRepresentation.format}} ]</div>
    <input [id]="identifier" type="text" class="datepicker" name="value" ngModel>
    <label [for]="identifier" >{{managedRepresentation.label}}</label>
    <span>Range  {{ managedRepresentation.inputLimit.minimum }} - {{ managedRepresentation.inputLimit.maximum }}</span>
  </div>
</ng-container>
`,
  styles: [],
})

export class ResponsedomainDatetimeComponent implements OnChanges {
  @Output() selectedEvent = new EventEmitter<UserResponse[]>();
  @Input() managedRepresentation: Category;

  public identifier;

  constructor(@Inject(LOCALE_ID) protected localID: string) {
    this.identifier = 'DATE-' + ident++;
  }


  ngOnChanges(changes: SimpleChanges): void {

    if (changes.value && changes.value.currentValue) {
      this.selectedEvent.emit([{ label: this.managedRepresentation.label, value: changes.value.currentValue }]);
    }

    if (changes.managedRepresentation && changes.managedRepresentation.currentValue) {
      delay(20).then(() => {
        this.initDate(this.managedRepresentation);
      });
    }
  }


  private initDate(rep: Category) {
    const elems = document.querySelectorAll('.datepicker');
    M.Datepicker.init(elems, {
      format: rep.format,
      autoClose: true,
      yearRange: [rep.inputLimit.minimum, rep.inputLimit.maximum],
      i18n: {
        months: getLocaleMonthNames(rep.xmlLang, 1, 2),
        monthsShort: getLocaleMonthNames(rep.xmlLang, 1, 1),
        weekdays: getLocaleDayNames(rep.xmlLang, 1, 2),
        weekdaysShort: getLocaleDayNames(rep.xmlLang, 1, 1)
      }
    });

  }

}

let ident = 0;
