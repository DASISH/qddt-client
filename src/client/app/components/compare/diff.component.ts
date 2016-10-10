import { Component, Input, OnChanges } from '@angular/core';
import { DiffString } from './diff.string';

export class ElementFieldChange {
  name: string;
  changes: any[];
};

export class ElementChange {
  name: string;
  version: string;
  changes: ElementFieldChange[];
};

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
  private diff: DiffString = new DiffString();
  private elementChange: ElementChange = new ElementChange();

  ngOnChanges() {
    this.elementChange.name = this.current['name'] || '';
    this.elementChange.version = this.compared.version.major + '.' + this.compared.version.minor
      + ' vs ' + this.current.version.major + '.' + this.current.version.minor;
    this.elementChange.changes = [];
    this.config.forEach(e => {
      let elementFieldChange = new ElementFieldChange();
      elementFieldChange.name = e['label'];
      let ret = this.diff.diff_main(this.getValue(this.compared, e['name']),
        this.getValue(this.current, e['name']));
      elementFieldChange.changes = ret;
      this.elementChange.changes.push(elementFieldChange);
    });
  }

  private getValue(obj: any, names: string | any[]): string {
    if (names instanceof Array) {
      let result: any = obj;
      names.forEach((e: any) => {
        if (result !== null
          && result[e] !== null
          && result[e] !== undefined) {
          result = result[e];
        } else {
          result = '';
        }
      });
      return result.toString();
    } else {
      if(obj[names] === null || obj[names] === undefined) {
        return '';
      }
      return obj[names].toString();
    }
  }
}
