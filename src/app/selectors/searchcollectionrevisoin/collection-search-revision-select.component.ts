import {Component, EventEmitter, Input, Output, ChangeDetectionStrategy, OnChanges, SimpleChanges, AfterViewInit} from '@angular/core';
import { ElementEnumAware } from '../../preview/preview.service';
import {IElement, IEntityAudit, IEntityEditAudit, IRevisionRef, IRevisionResultEntity} from '../../shared/classes/interfaces';
import { ElementKind } from '../../shared/classes/enums';
import { ElementRevisionRef, QueryInfo } from '../../shared/classes/classes';
import { QDDT_QUERY_INFOES } from '../../shared/classes/constants';
import { QddtMessageService } from '../../core/global/message.service';

@Component({
  selector: 'qddt-collection-revision-search-select',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './collection-search-revision-select.component.html'
})

@ElementEnumAware
export class CollectionSearchRevisionSelectComponent implements OnChanges, AfterViewInit {
  @Input() kind: ElementKind;
  @Input() showProgressBar = false;
  @Input() readonly = false;
  @Input() showList: ElementRevisionRef[];
  @Input() searchList: IEntityEditAudit[];
  @Input() revisionList: IRevisionResultEntity[];

  @Output() searchEvent = new EventEmitter<IElement>();
  @Output() getRevisionEvent = new EventEmitter<IRevisionRef>();

  public showButton = false;
  public showAddItem = false;
  public searchField: string;
  public labelName: string;

  private queryInfo: QueryInfo;

  constructor( private message: QddtMessageService) { }

  ngAfterViewInit() {
    this.queryInfo = this.getQueryInfo();
    this.labelName = this.queryInfo.label;
    this.searchField  = this.queryInfo.fields[0];
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['searchList']) {
    }
    if (changes['revisionList']) {
    }
  }
  public getQueryInfo(): QueryInfo {
    return QDDT_QUERY_INFOES[this.kind];
  }

  public onSearchElements(key) {
    this.searchEvent.emit({ element: key, elementKind: this.kind });
  }

  public onSelectElement(item: IElement) {
    this.getRevisionEvent.emit( { elementId: item.element.id, elementKind: this.kind, elementRevision: null } );
  }

  public onSelectedRevision(revision ) {
    this.showList.push(revision);
  }

  public onShowElement(element: IEntityAudit) {
    const  ref: IElement =  {
      element: element,
      elementKind: element.classKind };
    this.message.sendMessage( ref );
  }

  public onDeleteItem(index: number) {
    this.showList.splice(index, 1);
  }

  public onShowItems() {
    this.showAddItem = !this.showAddItem;
  }

}
