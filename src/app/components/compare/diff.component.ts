import {Component, EventEmitter, Inject, Input, LOCALE_ID, OnChanges, Output} from '@angular/core';
import {DiffString} from './diff.string';
import {formatDate} from '@angular/common';

export class ElementFieldChange {
  name: string;
  changes: any[];
}

export class ElementChange {
  name: string;
  version: string;
  changes: ElementFieldChange[];
}

@Component({
  selector: 'qddt-diff',

  providers: [],
  styleUrls: ['./diff.component.css'],
  templateUrl: './diff.component.html'
})

export class DiffComponent implements OnChanges {
  @Input() compared: any;
  @Input() current: any;
  @Input() config: any[];
  @Output() hideCompareEvent = new EventEmitter<any>();
  public elementChange: ElementChange = new ElementChange();
  private diff: DiffString = new DiffString();

  constructor(@Inject(LOCALE_ID) protected localID: string) { }

  ngOnChanges() {
    this.elementChange.name = this.current.name || '';
    this.elementChange.version = this.compared.version.major + '.' + this.compared.version.minor
      + ' vs Current working version';
    this.elementChange.changes = [];
    this.config.forEach(e => {
      const elementFieldChange = new ElementFieldChange();
      const init = e.init;
      elementFieldChange.name = e.label;
      elementFieldChange.changes =
        this.diff.diffMain(this.getValue(this.compared, e.name, init), this.getValue(this.current, e.name, init));
      this.elementChange.changes.push(elementFieldChange);
    });
  }

  onHide() {
    this.hideCompareEvent.emit('hide');
  }

  private readonly isDate = (x) => (null != x) && !isNaN(x) && ('undefined' !== typeof x.getDate);

  private getValue(obj: any, names: string | any[], init: any): string {
    if (names instanceof Array) {
      let result: any = obj;
      names.forEach((e: any) => {
        if (result !== null && result !== undefined) {
          if (result[e] !== null && result[e] !== undefined) {
            result = result[e];
          } else {
            result = '';
          }
        } else {
          result = '';
        }
      });
      if (init !== null && init !== undefined
        && result !== null && result !== undefined && result !== '') {
        return init(result);
      }
      if (this.isDate(result)) {
        return formatDate(result, 'short', this.localID);
      }
      return result.toString();
    } else {
      if (obj[names] === null || obj[names] === undefined) {
        return '';
      }
      return obj[names].toString();
    }
  }
}
