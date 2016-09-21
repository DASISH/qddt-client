import {Component, Input} from 'angular2/core';
import {DiffString} from './diff.string';

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
  directives: [],
  styleUrls: ['./diff.component.css'],
  templateUrl: './diff.component.html'
})

export class DiffComponent {
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
      let ret = this.diff.diff_main(this.compared[e['name']] || '', this.current[e['name']] || '');
      elementFieldChange.changes = ret;
      this.elementChange.changes.push(elementFieldChange);
    });
  }

}
