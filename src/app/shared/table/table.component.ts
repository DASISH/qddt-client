import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
import { Column } from './table.column';
import { Page } from './table.page';
import { IEntityEditAudit } from '../elementinterfaces/entityaudit';
import { LIST_COLUMNS, RESPONSEDOMAIN_COLUMNS, DEFAULT_COLUMNS } from './table.column-map';
import { ElementKind, QDDT_ELEMENTS } from '../elementinterfaces/elements';
import { DomainKind } from '../../responsedomain/responsedomain.constant';
import { ElementEnumAware } from '../../preview/preview.service';
import { Domain } from 'domain';

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
export class QddtTableComponent implements OnChanges {
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

  public readonly directionSign: { [dir: string]: string; } = {'': '⇳', 'asc': '▼', 'desc': '▲' };
  public value: string;   // TODO remove this....
  public rows = [];
  public columns: Column[];

   ngOnChanges() {
    this.init();
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


  private init() {
    this.columns = this.getColumns();
    this.placeholder =  QDDT_ELEMENTS[this.elementKind].placeholder();
    if (!this.page) { this.page = new Page; }
    if (!this.items) { this.items = []; }
    this.rows = [];

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
