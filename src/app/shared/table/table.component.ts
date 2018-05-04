
import {distinctUntilChanged, debounceTime} from 'rxjs/operators';
import {Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges, ViewChild, ElementRef, OnDestroy} from '@angular/core';
import { Column } from './table.column';
import { LIST_COLUMNS, RESPONSEDOMAIN_COLUMNS, DEFAULT_COLUMNS } from './table.column-map';
import { QDDT_QUERY_INFOES } from '../classes/constants';
import { IEntityEditAudit, IPageSearch } from '../classes/interfaces';
import { ElementKind } from '../classes/enums';
import { ElementEnumAware } from '../../preview/preview.service';
import { DomainKind } from '../../responsedomain/responsedomain.classes';
import {Subject} from 'rxjs';

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
export class QddtTableComponent implements OnInit, OnChanges, OnDestroy {
  /**
   * number: the current page beginning with zero
   * size: the size of each page
   * totalElements: the total number of elements
   * totalPages: the total pages
   */
  @Input() domainkind: DomainKind;
  @Input() pageSearch: IPageSearch;
  @Input() items: IEntityEditAudit[];

  @Output() detailEvent = new EventEmitter<IEntityEditAudit>();
  @Output() fetchEvent = new EventEmitter<IPageSearch>();

  public readonly directionSign: { [dir: string]: string; } = {'': '⇳', 'asc':  '▲', 'desc': '▼'};
  public value: string;

  public placeholder: string;
  public rows = [];
  public columns: Column[];

  @ViewChild('fkRef') _fkRef: ElementRef;

  private searchKeysChange: Subject<string> = new Subject<string>();

  constructor() {
    this.searchKeysChange.pipe(
      debounceTime(300),
      distinctUntilChanged(),)
      .subscribe((name: string) => {
        this.pageSearch.key = this.value = name;
        this.pageSearch.sort = this.getSort();
        this.fetchEvent.emit(this.pageSearch);
      });
  }
  ngOnInit(): void {
    this.columns = this.getColumns();
    if (!this.items) { this.items = []; }
    // this.fetchEvent.emit(this.pageSearch); created double loading on init ( better to initialize from parent...)
  }

  ngOnChanges(changes: SimpleChanges): void {

    this.columns = this.getColumns();

    if (!this.items) { this.items = []; }

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
    this.pageSearch.page.number = p;
    this.pageSearch.sort = this.getSort();
    this.fetchEvent.emit(this.pageSearch);
  }

  enterText(event: any) {
    this.searchKeysChange.next(event.target.value);
  }

  onClearKeywords() {
    this.pageSearch.key = this.value = '*';
    this.pageSearch.sort = this.getSort();
    this.fetchEvent.emit(this.pageSearch);
    this._fkRef.nativeElement.focus();
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
        this.pageSearch.sort = this.getSort();
        this.fetchEvent.emit(this.pageSearch);
    }
  }

  private makePlaceholder(searchString: string): string  {
    const qe = QDDT_QUERY_INFOES[this.pageSearch.kind];

    if (!searchString || searchString.length === 0) { return qe.placeholder(); }

    const args = searchString.split(' ');
    const queries = [];

    if (args.length <= qe.fields.length) {
      for (let i = 0; i <  qe.fields.length; i++) {
        if (i < args.length ) {
          queries.push(qe.fields[i] + '=\'' + args[i].trim() + '\'');
        } else {
          queries.push(qe.fields[i] + '=?');
        }
      }
    } else {
      for (let i = 0; i < qe.fields.length; i++) {
        queries.push(qe.fields[i] + '=\'' + searchString.trim() + '\'');
      }
    }
    return   'Search in [' + queries.join(' & ') + ']';
  }

  private getColumns(): Column[] {
    const kind = this.pageSearch.kind;
    if (kind === ElementKind.RESPONSEDOMAIN) {
      return RESPONSEDOMAIN_COLUMNS.get(DomainKind[this.pageSearch.keys.get('ResponseKind')]);
    }

    if (LIST_COLUMNS.has(kind)) {
      return LIST_COLUMNS.get(kind);
    }

    return DEFAULT_COLUMNS;
  }

  ngOnDestroy(): void {
    this.searchKeysChange.unsubscribe();
  }


}
