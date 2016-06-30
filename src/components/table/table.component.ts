import {Component, Input, Output, EventEmitter} from 'angular2/core';

@Component({
  selector: 'qddt-table',
  moduleId: module.id,
  templateUrl: './table.component.html',
})

export class QddtTableComponent {

  @Input() page: any;
  @Input() columns: any[];
  @Input() items: any[];
  @Output() detailEvent: EventEmitter<String> = new EventEmitter();
  @Output() pageEvent: EventEmitter<String> = new EventEmitter();

  private rows: any[] = [];
  private _rows: any[] = [];
  private pages: number[] = [];

  ngOnChanges() {
    this.init();
  }

  setPage(middle: number, total: number) {
    if(total < 9) {
      this.pages = Array(total).fill(0).map((e,i)=> i);
      return;
    }
    this.pages = [];
    for(let i:number = middle > 4? middle -4: 0; i < (middle + 4) && i < total; i++) {
      this.pages.push(i);
    }
  }

  onDetail(item: any) {
    this.detailEvent.emit(item);
  }

  onPage(p: number) {
    this.pageEvent.emit(p.toString());
  }

  onPrev(p: number) {
    if(p < 0) {
      return;
    }
    this.setPage(p - 4, this.page.totalPages);
  }

  onNext(p: number) {
    if(p >= this.page.totalPages) {
      return;
    }
    this.setPage(p + 4, this.page.totalPages);
  }

  enterText(event) {
    let value = event.target.value;
    this.filterItems(value);
  }

  sortRows(column: any) {
    if(column.sortable === undefined || !column.sortable) {
      return;
    }
    this.rows = this.rows.sort((a,b) => a[column.name].toLowerCase() > b[column.name].toLowerCase() ? 1: -1);
  }

  private filterItems(search: string) {
    if(search === undefined || search.length === 0) {
      this.rows = this._rows;
      return;
    }
    let field = 'label';
    this.rows = this._rows.filter(
      function (row) {
        return (row[field] !== undefined
          && row[field].toLowerCase().indexOf(search.toLowerCase()) >= 0);
    });
  }

  private init() {
    this.rows = [];
    this.items.forEach((item:any) => {
      var date:Date = new Date();
      if(item.modified !== undefined && item.modified.length > 2) {
        date.setUTCFullYear(item.modified[0], item.modified[1] - 1, item.modified[2]);
      }
      let row = { 'id': item.id,
        'Version' : item.version.major + '.' + item.version.minor,
        'Agency': item.agency.name || '',
        'Modified': date.toDateString(),
        'modifiedBy': item.modifiedBy.username || '',
        'Object': item,
      };
      this.columns.forEach((column:any) => {
        if (row[column.name] === undefined) {
          row[column.name] = item[column.name];
        }
      });
      this.rows.push(row);
      ['Version', 'Agency', 'Modified', 'modifiedBy'].forEach((item: any) => {
        let column = this.columns.find((column:any) => column.name === item);
        if (!column) {
          this.columns.push({'name': item, 'label': item, 'sortable': false});
        }
      });
    });
    this._rows = this.rows;
    if(this.page !== undefined
      && this.page.number !== undefined
      && this.page.totalPages !== undefined) {
      this.setPage(this.page.number, this.page.totalPages);
    }
  }
}
