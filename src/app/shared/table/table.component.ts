import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
import { Column } from './table.column';
import { IEntityEditAudit } from '../elementinterfaces/entityaudit';

@Component({
  selector: 'qddt-table',
  styles: [':host /deep/ i.left  { margin-right: 0px; }',
    'th { white-space: nowrap;}',
    'td, td div { max-width: 400px;  white-space: nowrap;  overflow: hidden; text-overflow: ellipsis;}',
    'table { table-layout:auto;}'],
  moduleId: module.id,
  templateUrl: './table.component.html',
})


export class QddtTableComponent implements OnInit, OnChanges {
  /**
   * number: the current page beginning with zero
   * size: the size of each page
   * totalElements: the total number of elements
   * totalPages: the total pages
  */
  @Input() page: any;
  /** each column includes:
   * name: string or string array
   * label: column header
   * sortable: whether sortable
   */
  @Input() columns: Column[];
  @Input() items: any[];
  @Input() placeholder: string;

  @Output() detailEvent: EventEmitter<String> = new EventEmitter<String>();
  @Output() pageChangeEvent: EventEmitter<String> = new EventEmitter<String>();
  @Output() enterEvent: EventEmitter<any> = new EventEmitter<any>();

  public readonly directionSign: { [dir: string]: String; } = {'': '⇳', 'asc': '▼', 'desc': '▲' };
  public value: string;   // TODO remove this....
  public rows: any[] = [];

  ngOnInit() {
    if (!this.placeholder) {
      this.placeholder = 'Search';
    }
    if (!this.page) {
      this.page =  { number: 1, size: 10 };
    }
  }

  ngOnChanges() {
    this.init();
  }

  onDetail(item: any) {
    this.detailEvent.emit(item);

  }

  pageChange(p: number) {
    this.pageChangeEvent.emit(p.toString());
  }

  enterText(event: any) {
    this.value = event.target.value;
    this.enterEvent.emit(this.value);
  }

  onClearKeywords() {
    this.value = '';
    this.enterEvent.emit(this.value);
  }

  public getSort() {
    const i = this.columns.findIndex((e) => e.sortable && e.direction !== '');
    let sort = '';
    if (i >= 0) {
      if (typeof this.columns[i].name === 'string') {
        sort = this.columns[i].name + ',' + this.columns[i].direction;
      } else {
        sort = this.columns[i].name.join('.') + ',' + this.columns[i].direction;
      }
    }
    return sort;
  }


  sortRows(column: Column) {
    if ( !column.sortable ) { return; }

    this.columns.forEach((col) => {
      col.direction = (col !== column) ? '' : this.nextSort(column.direction);
    });

    this.pageChangeEvent.emit('0');
  }


  private nextSort(current: string ): string {
    switch (current ) {
      case '': return 'asc';
      case 'asc': return 'desc';
      default: return '';
    }
  }


  private init() {
    this.rows = [];
    if (!this.columns) { this.columns = []; }
    ['Modified', 'Version', 'Agency'].forEach((colName) => {
      const index = this.columns.findIndex((col) => col.label === colName);
      if (index < 0) {
        this.columns.push( new Column({ name: colName, label: colName, sortable: false }));
      }
    });

    this.items.forEach((item: IEntityEditAudit) => {
      const date: Date = new Date();
      date.setTime(item.modified);

      const row: any = {
        'id': item.id,
        'Version': (item.version) ? item.version.major + '.' + item.version.minor : '',
        'Agency': (item.agency) ? item.agency.name : '',
        'Modified': date.toDateString(),
        'Object': item,
      };

      this.columns.forEach((column) => {
        if (row[column.label] === undefined) {
          let colref = item;
          if (column.name instanceof Array) {
            column.name.forEach(name => colref = colref[name]);
          } else {
            colref = colref[column.name];
          }
          row[column.label] = colref;
        }
      });
      this.rows.push(row);
    });
  }
}
