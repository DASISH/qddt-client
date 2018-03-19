import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
import { Column } from './table.service';

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

  /**
   * searchable results from server
   */
  @Input() searchFromServer = true;
  @Output() detailEvent: EventEmitter<String> = new EventEmitter<String>();
  @Output() pageChangeEvent: EventEmitter<String> = new EventEmitter<String>();
  @Output() enterEvent: EventEmitter<any> = new EventEmitter<any>();

  public readonly directionSign: { [dir: string]: String; } = {'': '⇳', 'asc': '⇩', 'desc': '⇧' };
  public value: string;
  public rows: any[] = [];

  private _rows: any[] = [];

  ngOnInit() {
    if (this.placeholder === null || this.placeholder === undefined) {
      this.placeholder = 'Search';
    }
    if (this.page === null || this.page === undefined) {
      this.page =  {number: 1, size: 10};
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
    if (this.searchFromServer) {
      this.enterEvent.emit(this.value);
    }
  }

  onClearKeywords() {
    this.value = '';
    if (this.searchFromServer) {
      this.enterEvent.emit(this.value);
    }
  }

  sortRows(column: any) {
    if (column.sortable === undefined || !column.sortable) {
      return;
    }
    this.columns.forEach((e: any) => { if (e !== column) { e.direction = ''; } });
    if (column.direction === '') {
        column.direction = 'asc';
    } else if (column.direction === 'asc') {
      column.direction = 'desc';
    } else {
      column.direction = '';
    }
    this.pageChangeEvent.emit('0');
  }

  public getSort() {
    const i = this.columns.findIndex((e: any) => e.sortable && e.direction !== '');
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


  private init() {
    this.rows = [];
    this.items.forEach((item: any) => {
      const date: Date = new Date();
      date.setTime(parseInt(item.modified));

      let version = '';
      if (item.version !== null && item.version !== undefined) {
        version = item.version.major + '.' + item.version.minor;
        // if (item.version.versionLabel ==='In Development')
        //   version += ' <i class="material-icons white yellow-text tiny" title="Latest changes, not saved as a version">error</i>';
      }
      let name = '';
      if (item.agency !== null && item.agency !== undefined) {
        name = item.agency.name;
      }
      const row: any = {
        'id': item.id,
        'Version': version,
        'Agency': name,
        'Modified': date.toDateString(),
        'Object': item,
      };
      if (this.columns === null || this.columns === undefined) {
        this.columns = [];
      }
      this.columns.forEach((column: any) => {
        if (row[column.label] === undefined) {
          if (column.name instanceof Array) {
            let result: any = item;
            column.name.forEach((element: any) => {
              if (result !== null && result[element] !== undefined) {
                result = result[element];
              } else {
                result = '';
              }
            });
            row[column.label] = result;
          } else {
            row[column.label] = item[column.name];
          }
        }
      });
      this.rows.push(row);
      ['Modified', 'Version', 'Agency'].forEach((item: any) => {
        const column = this.columns.find((column: any) => column.label === item);
        if (!column) {
          this.columns.push({ name: item, label: item, sortable: false , direction: ''});
        }
      });
    });
    this._rows = this.rows;
  }
}
