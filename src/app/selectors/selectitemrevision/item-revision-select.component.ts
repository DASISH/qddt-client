import { Component, OnChanges, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { ElementRevisionRef} from '../../shared/classes/classes';
import { IEntityAudit, IRevisionResultEntity, IRevisionRef, IElement} from '../../shared/classes/interfaces';
import { QDDT_QUERY_INFOES} from '../../shared/classes/constants';
import { ElementKind} from '../../shared/classes/enums';
import { ElementEnumAware } from '../../preview/preview.service';

@Component({
  selector: 'qddt-item-revision-select',
  moduleId: module.id,
  templateUrl: './item-revision-select.component.html',
})

@ElementEnumAware
export class ItemRevisionSelectComponent implements OnChanges {
  showRevision: boolean;
  @Input() kind: ElementKind;
  @Input() itemList: IEntityAudit[];
  @Input() revisionList: IRevisionResultEntity[];
  @Input() showProgressBar = false;

  @Output() enterEvent = new EventEmitter<IElement>();
  @Output() revisionEvent = new EventEmitter<IRevisionRef>();
  @Output() selectEvent = new EventEmitter<ElementRevisionRef>();
  @Output() dismissEvent = new EventEmitter<Boolean>();


  ngOnChanges(changes: SimpleChanges): void {
    if (changes['itemList']) {
    }
    if (changes['revisionList']) {
      this.showRevision  = true;
    }
  }

  public onSearchElements(key) {
    this.enterEvent.emit({ element: key, elementKind: this.kind });
  }

  public onSelectElement(item: IElement) {
    this.showRevision  = true;
    this.revisionEvent.emit( { elementId: item.element.id, elementKind: this.kind, elementRevision: null } );
  }

  public onSelectedRevision(revision) {
    this.showRevision  = false;
    this.selectEvent.emit(revision);
  }

  public onDismiss(ok) {
    this.showRevision  = false;
    this.dismissEvent.emit(ok);
  }
}
