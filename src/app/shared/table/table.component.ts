import {Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges} from '@angular/core';
import { Column } from './table.column';
import { LIST_COLUMNS, RESPONSEDOMAIN_COLUMNS, DEFAULT_COLUMNS } from './table.column-map';
import { DomainKind } from '../../responsedomain/responsedomain.constant';
import { ElementEnumAware } from '../../preview/preview.service';
import { ElementKind } from '../classes/enums';
import { Page } from '../classes/classes';
import { IEntityEditAudit } from '../classes/interfaces';
import { QDDT_QUERY_INFOES } from '../classes/constants';

@Component({
  selector: 'qddt-table',
  styles: [
    ':host /deep/ i.left  { margin-right: 0px; }',
    'th { white-space: nowrap;}',
    'td, td div { max-width: 400px;  white-space: nowrap;  overflow: hidden; text-overflow: ellipsis;}',
    'table { table-layout:auto;}'],
  moduleId: module.id,
  templateUrl: './table.component.html',
})

@ElementEnumAware
export class QddtTableComponent implements OnInit, OnChanges {
  /**
   * number: the current page beginning with zero
   * size: the size of each page
   * totalElements: the total number of elements
   * totalPages: the total pages
   */
  @Input() elementKind: ElementKind;
  @Input() domainkind: DomainKind;
  @Input() placeholder: String = null;
  @Input() page: Page;
  @Input() items: IEntityEditAudit[];

  @Output() detailEvent = new EventEmitter<IEntityEditAudit>();
  @Output() pageChangeEvent = new EventEmitter<Page>();
  @Output() enterEvent = new EventEmitter<string>();

  public readonly directionSign: { [dir: string]: string; } = {'': '⇳', 'asc':  '▲', 'desc': '▼'};
  public value: string;   // TODO remove this....
  public rows = [];
  public columns: Column[];

  ngOnInit(): void {
    this.columns = this.getColumns();
    if (!this.page) { this.page = new Page; }
    if (!this.items) { this.items = []; }
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
    if (changes['domainkind']) {
      this.columns = this.getColumns();
    } else if (!this.columns) {
      this.columns = this.getColumns();
    }
    if (!this.items) { this.items = []; }
    if (!this.page) { this.page = new Page; }

    this.placeholder = this.makePlaceholder(this.value);

    this.rows = [];

    this.items.forEach((item: IEntityEditAudit) => {
      const date: Date = new Date();
      date.setTime(item.modified);

      const row: any = {
        'id': item.id,
        'Version': (item.version) ? item.version.major + '.' + item.version.minor : '',
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

  onDetail(item: IEntityEditAudit) {
    this.detailEvent.emit(item);
  }


  pageChange(p: number) {
    this.page.number = p;
    this.pageChangeEvent.emit(this.page);
  }

  enterText(event: any) {
    this.value = event.target.value;
    this.placeholder = this.makePlaceholder(this.value);
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
    if (column.sortable) {
      column.nextSort();
      this.columns
        .filter((c) => c.name !== column.name)
        .forEach((col) => col.direction = '');
      this.page.sort = this.getSort();
      this.pageChangeEvent.emit(this.page);
    }
  }

  private makePlaceholder(searchString: string): string  {
    const qe = QDDT_QUERY_INFOES[this.elementKind];

    if (!searchString || searchString.length === 0) { return qe.placeholder(); }

    const args = searchString.split(' ');
    const queries = [];

    if (args.length <= qe.fields.length) {
      for (let i = 0; i < args.length; i++) {
        queries.push(qe.fields[i] + '=\'' + args[i].trim() + '\'');
      }
    } else {
      for (let i = 0; i < qe.fields.length; i++) {
        queries.push(qe.fields[i] + '=\'' + searchString.trim() + '\'');
      }
    }
    return   'Search in [' + queries.join(' & ') + ']';
  }

  private getColumns(): Column[] {
    if (this.elementKind === ElementKind.RESPONSEDOMAIN) {
      return RESPONSEDOMAIN_COLUMNS.get(this.domainkind);
    }

    if (LIST_COLUMNS.has(this.elementKind)) {
      return LIST_COLUMNS.get(this.elementKind);
    }

    return DEFAULT_COLUMNS;
  }


}
