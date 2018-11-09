import {Component, EventEmitter, Input, Output, ChangeDetectionStrategy, OnChanges, SimpleChanges, AfterViewInit} from '@angular/core';
import { ElementEnumAware } from '../../preview/preview.service';
import { MessageService } from '../../core/services/message.service';
import {
  ElementKind,
  ElementRevisionRef, getQueryInfo,
  IElement,
  IEntityEditAudit,
  IRevisionRef,
  IRevisionResultEntity,
  QueryInfo
} from '../../shared/classes';

@Component({
  selector: 'qddt-collection-revision-search-select',
  changeDetection: ChangeDetectionStrategy.OnPush,

  styles: ['.li.over { border: 2px dashed green;}', '.col {white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }'],
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

  @Output() searchItems = new EventEmitter<IElement>();
  @Output() searchRevision = new EventEmitter<IRevisionRef>();
  @Output() loadElement =  new EventEmitter<ElementRevisionRef>();

  public showButton = false;
  public showAddItem = false;
  public searchField: string;
  public labelName: string;

  private queryInfo: QueryInfo;

  constructor( private message: MessageService) { }

  ngAfterViewInit() {
    this.queryInfo = getQueryInfo(this.kind);
    this.labelName = this.queryInfo.label;
    this.searchField  = this.queryInfo.fields[0];
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['searchList']) {
    }
    if (changes['revisionList']) {
    }
  }

  onDrop(evt: any) {
    evt.preventDefault();
    evt.stopPropagation();
    evt.currentTarget.style.border = 'none';
    const item = evt.dataTransfer.getData('application/json');
    console.log(item);
    // your code goes here after droping files or any
  }

  onDragOver(evt) {
     evt.preventDefault();
     evt.stopPropagation();
     evt.currentTarget.style.border = 'dashed';
    }

  onDragLeave(evt) {
     evt.preventDefault();
     evt.stopPropagation();

    }

  onDragStart(event, item) {
    event.currentTarget.style.border = 'dashed';
    // Set the drag's format and data. Use the event target's id for the data
    event.dataTransfer.setData('application/json', item);
    event.dataTransfer.dropEffect = 'move';
  }

  public onSearchElements(key) {
    this.searchItems.emit({ element: key, elementKind: this.kind });
  }

  public onSelectElement(item: IElement) {
    this.searchRevision.emit( { elementId: item.element.id, elementKind: this.kind, elementRevision: null } );
  }

  public onSelectedRevision(revision: ElementRevisionRef ) {
    this.showList.push(revision);
  }

  public onShowElement(element: ElementRevisionRef) {
    this.message.sendMessage( element );
  }

  public onDeleteItem(index: number) {
    this.showList.splice(index, 1);
  }

  public onShowItems() {
    this.showAddItem = !this.showAddItem;
  }

}
