
import { distinctUntilChanged, debounceTime} from 'rxjs/operators';
import { Subject} from 'rxjs';
import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges, OnDestroy} from '@angular/core';
import { Column } from './table.column';
import { LIST_COLUMNS, RESPONSEDOMAIN_COLUMNS, DEFAULT_COLUMNS } from './table.column-map';
import { ElementEnumAware, PreviewService } from '../../preview/preview.service';
import { UserService } from '../../core/services/user.service';
import { DomainKind } from '../../responsedomain/responsedomain.classes';
import { ElementKind, getQueryInfo, IEntityEditAudit, IPageSearch, QueryInfo, ActionKind } from '../classes';
import { QddtMessageService } from '../../core/services/message.service';

const filesaver = require('file-saver');
declare var $;
declare var Materialize: any;

@Component({
  selector: 'qddt-table',
  styles: [
    ':host /deep/ i.left  { margin-right: 0px; }',
    'th { white-space: nowrap;}',
    'td, td div { max-width: 400px;  white-space: nowrap;  overflow: hidden; text-overflow: ellipsis;}',
    'table { table-layout:auto;}'],

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
  // @Input() domainkind: DomainKind;
  @Input() pageSearch: IPageSearch;
  @Input() items: IEntityEditAudit[];

  @Output() detailEvent = new EventEmitter<IEntityEditAudit>();
  @Output() deleteEvent = new EventEmitter<IEntityEditAudit>();
  @Output() fetchEvent = new EventEmitter<IPageSearch>();

  public readonly directionSign: { [dir: string]: string; } = {'': '⇳', 'asc':  '▲', 'desc': '▼'};
  public searchKeysChange: Subject< { name: string, value: string }> = new Subject<{ name: string, value: string }>();

  public canDelete = false;
  public canExport = false;
  public showProgressBar = false;
  public rows = [];
  public columns: Column[];
  public fields = { simplesearch: '' };
  public fieldNames;
  public placeholder: string;

  constructor(private previewService: PreviewService, public access: UserService, public message: QddtMessageService ) {
    this.searchKeysChange.pipe(
      debounceTime(300),
      distinctUntilChanged())
      .subscribe((field) => {
        if (field.name === 'simplesearch') {
          this.pageSearch.key = field.value;
        } else {
          this.pageSearch.keys.set(field.name, field.value);
        }
        this.pageSearch.sort = this.getSort();
        this.pageSearch.page.number = 0;
        this.showProgressBar = true;
        this.fetchEvent.emit(this.pageSearch);
      });
  }

  public ngOnInit(): void {
    this.columns = this.getColumns();
    if (!this.items) { this.items = []; }

    this.initQueryInfo();
  }

  public ngOnDestroy(): void {
    this.searchKeysChange.unsubscribe();
  }

  public ngOnChanges(changes: SimpleChanges): void {

    this.showProgressBar = false;

    this.columns = this.getColumns();

    if (!this.items) { this.items = []; }

    if (!this.pageSearch.keys) {
      console.log('new keys');
      this.pageSearch.keys = new Map<string, string>(); }
    const qe = getQueryInfo(this.pageSearch.kind);
    this.placeholder = qe.placeholder();

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

    Materialize.updateTextFields();
  }

  public onDetail(item: IEntityEditAudit) {
    this.detailEvent.emit(item);
  }

  public onViewRevision(item: IEntityEditAudit) {
    this.message.sendMessage( { elementId: item.id, elementRevision: null, elementKind: item.classKind});
  }

  public onConfirmDeleting(item: IEntityEditAudit) {
    this.deleteEvent.emit(item);
  }

  public onGetPdf(item: IEntityEditAudit) {
      const fileName = item.name + '.pdf';
      this.previewService.getPdf(item).then((data: any) => { filesaver.saveAs(data, fileName); });
  }

  public onDetailChecked() {
    this.pageSearch.hasDetailSearch = !this.pageSearch.hasDetailSearch;
    if (this.pageSearch.hasDetailSearch) {
      this.pageSearch.key = '';
    } else {
        this.pageSearch.keys.clear();
    }
    this.initQueryInfo();
    this.searchKeysChange.next( { name: 'name', value: ''});
  }

  public pageChange(p: number) {
    this.pageSearch.page.number = p;
    this.pageSearch.sort = this.getSort();
    this.showProgressBar = true;
    this.fetchEvent.emit(this.pageSearch);
  }

  public onClear(name: string) {
    this.fields[name] = '';
    this.searchKeysChange.next( { name: name, value: ''});
    // this.pageSearch.sort = this.getSort();
    // this.fetchEvent.emit(this.pageSearch);
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

  public sortRows(column: Column) {
    if (column.sortable) {
      column.nextSort();
      this.columns
        .filter((c) => c.name !== column.name)
        .forEach((col) => col.direction = '');
        this.pageSearch.sort = this.getSort();
      this.showProgressBar = true;
      this.fetchEvent.emit(this.pageSearch);
    }
  }

  private getColumns(): Column[] {
    const kind = this.pageSearch.kind;
    if (kind === ElementKind.RESPONSEDOMAIN) {    // special rule, Responsdomains different kinds need different columns
      return RESPONSEDOMAIN_COLUMNS.get(DomainKind[this.pageSearch.keys.get('ResponseKind')]);
    }

    if (LIST_COLUMNS.has(kind)) {
      return LIST_COLUMNS.get(kind);
    }

    return DEFAULT_COLUMNS;
  }

  private initQueryInfo() {
    const qe = getQueryInfo(this.pageSearch.kind) as QueryInfo;
    this.fields.simplesearch = this.pageSearch.key;
    qe.fields.forEach(value => this.fields[value] = (this.pageSearch.keys.get(value) || ''));
    this.fieldNames = qe.fields;
    this.placeholder = qe.placeholder();
    this.canDelete = this.access.canDo(ActionKind.Delete, qe.id);
    this.canExport = this.access.canDo(ActionKind.Export, qe.id);
  }

}
