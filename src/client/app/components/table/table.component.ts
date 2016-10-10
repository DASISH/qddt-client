import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';

@Component({
  selector: 'qddt-table',
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
  @Input() columns: any[];
  @Input() items: any[];
  /**
   * searchable results from server
   */
  @Input() searchFromServer: boolean;
  @Output() detailEvent: EventEmitter<String> = new EventEmitter<String>();
  @Output() pageChangeEvent: EventEmitter<String> = new EventEmitter<String>();
  @Output() enterEvent: EventEmitter<any> = new EventEmitter<any>();

  private rows: any[] = [];
  private _rows: any[] = [];

  ngOnInit() {
    if(this.searchFromServer === null) {
      this.searchFromServer = false;
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
    let value = event.target.value;
    if(this.searchFromServer) {
      this.enterEvent.emit(value);
    } else {
      this.filterItems(value);
    }
  }

  sortRows(column: any) {
    if (column.sortable === undefined || !column.sortable) {
      return;
    }
    this.rows = this.rows.sort((a, b) => a[column.label].toLowerCase() > b[column.label].toLowerCase() ? 1 : -1);
  }

  private filterItems(search: string) {
    if (search === undefined || search.length === 0) {
      this.rows = this._rows;
      return;
    }
    let columns = this.columns;
    this.rows = this._rows.filter(
      function (row) {
        let items = columns.filter(function (column) {
          return (row[column.label] !== undefined && row[column.label] !== null && column.sortable === true
            && row[column.label].toLowerCase().indexOf(search.toLowerCase()) >= 0);
        });
        return items.length > 0;
      });
  }

  private init() {
    this.rows = [];
    this.items.forEach((item: any) => {
      var date: Date = new Date();
      if (item.modified !== undefined && item.modified.length > 2) {
        date.setUTCFullYear(item.modified[0], item.modified[1] - 1, item.modified[2]);
      }
      let row: any = {
        'id': item.id,
        'Version': item.version.major + '.' + item.version.minor,
        'Agency': item.agency.name || '',
        'Modified': date.toDateString(),
        'modifiedBy': item.modifiedBy.username || '',
        'Object': item,
      };
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
      ['Version', 'Agency', 'Modified', 'modifiedBy'].forEach((item: any) => {
        let column = this.columns.find((column: any) => column.label === item);
        if (!column) {
          this.columns.push({ 'name': item, 'label': item, 'sortable': false });
        }
      });
    });
    this._rows = this.rows;
  }
}
