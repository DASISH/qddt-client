import {debounceTime, distinctUntilChanged} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {AfterViewInit, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core';
import {Column} from './table.column';
import {DEFAULT_COLUMNS, LIST_COLUMNS, RESPONSEDOMAIN_COLUMNS} from './table.column.config';
import {
  ActionKind, DomainKind,
  ElementEnumAware,
  ElementKind,
  getQueryInfo,
  IEntityEditAudit,
  IPageSearch,
  IRevisionRef, MessageService,
  PreviewService,
  QueryInfo, SessionService, UserService
} from '../../lib';

import filesaver from 'file-saver';
import {formatDate} from '@angular/common';

declare var $;
declare var Materialize: any;

@Component({
  selector: 'qddt-table',
  styles: [
    ':host ::ng-deep i.left  { margin-right: 0px; }',
    'th { white-space: nowrap;}',
    'td, td div { max-width: 400px;  white-space: nowrap;  overflow: hidden; text-overflow: ellipsis;}',
    'table { table-layout:auto;}'],

  templateUrl: './table.component.html',
})

@ElementEnumAware
export class QddtTableComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit {
  /**
   * number: the current page beginning with zero
   * size: the size of each page
   * totalElements: the total number of elements
   * totalPages: the total pages
   */
  @Input() pageSearch: IPageSearch;
  @Input() items: IEntityEditAudit[];

  @Output() detailEvent = new EventEmitter<IEntityEditAudit>();
  @Output() deleteEvent = new EventEmitter<IEntityEditAudit>();
  @Output() fetchEvent = new EventEmitter<IPageSearch>();

  public readonly directionSign: { [dir: string]: string; } = {'': '⇳', 'asc':  '▲', 'desc': '▼'};
  public searchKeysChange: Subject< { name: string, value: string }> = new Subject<{ name: string, value: string }>();

  public canDelete = false;
  public canExport = false;
  public canPreview = false;
  public canEdit = true;
  public showProgressBar = false;
  public rows = [];
  public columns: Column[];
  public fields = { simpleSearch: '' };
  public fieldNames;
  public placeholder: string;

  constructor(private previewService: PreviewService, public access: UserService, public message: MessageService, public session: SessionService) {
    this.searchKeysChange.pipe(
      debounceTime(300),
      distinctUntilChanged())
      .subscribe((field) => {
        if (field.name === 'simpleSearch') {
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


  ngAfterViewInit() {
    // fires after returning from detailview
    $(document).ready(function () {
      Materialize.updateTextFields();
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
    console.debug(this.session.locale);

    this.showProgressBar = false;

    this.columns = this.getColumns();

    if (!this.items) { this.items = []; }

    if (!this.pageSearch.keys) {
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
        'Modified': formatDate(date, 'shortDate', this.session.locale)  ,
        'Object': item,
      };

      this.columns.forEach((column) => {
        if (row[column.label] === undefined) {
          if (column.name === 'modifiedBy') {
            if (item['agency']) {
              row[column.label] = item[column.name]['name'] + '@' + item['agency']['name'];
            } else {
              row[column.label] = item[column.name]['name'] + '@' + item[column.name]['agencyName'];
            }
          } else if (column.name instanceof Array) {
            let colref = item;
            column.name.forEach(colName => colref = colref[colName]);
            row[column.label] = colref;
          } else {
            row[column.label] = item[column.name];
          }
        }
      });
      this.rows.push(row);
    });
    Materialize.updateTextFields();
  }

  public onDetail(item: IEntityEditAudit) {
    this.detailEvent.emit(item);
  }

  // public onViewRevision(item: IEntityEditAudit) {
  //   this.message.sendMessage( { elementId: item.id, elementRevision: null, elementKind: item.classKind});
  // }

  public onPreview(item) {
    // console.log(item || JSON);
    this.message.sendMessage( { elementId: item.refId, elementRevision: item.refRev, elementKind: item.refKind} as IRevisionRef);
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
    this.initQueryInfo();
    this.fetchEvent.emit(this.pageSearch);
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
    this.fields.simpleSearch = this.pageSearch.key;
    qe.fields.forEach(value => this.fields[value] = (this.pageSearch.keys.get(value) || ''));
    this.fieldNames = qe.fields;
    this.placeholder = qe.placeholder();
    console.log('canDelete?');
    this.canDelete = this.access.canDo(ActionKind.Delete, qe.id);
    this.canExport = this.access.canDo(ActionKind.Export, qe.id);
    this.canEdit =   this.access.canDo(ActionKind.Update, qe.id);
    this.canPreview = (qe.id === ElementKind.CHANGE_LOG);
  }

}
