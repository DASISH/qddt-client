import { Component, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { DiffString } from './diff.string';

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
  moduleId: module.id,
  providers: [],
  styleUrls: ['./diff.component.css'],
  templateUrl: './diff.component.html'
})

export class DiffComponent implements OnChanges {
  @Input() compared: any;
  @Input() current: any;
  @Input() config: any[];
  @Output() hideCompareEvent: EventEmitter<any> = new EventEmitter<any>();
  private diff: DiffString = new DiffString();
  private elementChange: ElementChange = new ElementChange();

  ngOnChanges() {
    this.elementChange.name = this.current['name'] || '';
    this.elementChange.version = this.compared.version.major + '.' + this.compared.version.minor
      + ' vs Current working version';
    this.elementChange.changes = [];
    this.config.forEach(e => {
      const elementFieldChange = new ElementFieldChange();
      elementFieldChange.name = e['label'];
      const init = e['init'];
      const ret = this.diff.diff_main(this.getValue(this.compared, e['name'], init),
        this.getValue(this.current, e['name'], init));
      elementFieldChange.changes = ret;
      this.elementChange.changes.push(elementFieldChange);
    });
  }

  onHide() {
    this.hideCompareEvent.emit('hide');
  }

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
      return result.toString();
    } else {
      if (obj[names] === null || obj[names] === undefined) {
        return '';
      }
      return obj[names].toString();
    }
  }
}
