import { AfterViewInit, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import {
  ActionKind,
  ElementKind, ElementRevisionRef, EventAction,
  getElementKind, getIcon,
  Factory,
  IElement, IRevisionRef, ISelectOption,
  MessageService,
  TemplateService,
  Parameter
} from '../../../lib';
import { Router } from '@angular/router';


@Component({
  selector: 'qddt-element-revision-ref',
  styles: [
    'ul.collapsible { padding: 1px; border: 0; margin-top:0; margin-bottom: 0; }',
    'ul.collapsible  ul.collapsible {  margin-left: 1rem; }',
    '.collapsible-header {padding: 0.75rem; }',
    '.collapsible-header:hover > ul.dropleft { display:block; }',
  ],
  templateUrl: './element-revision-ref.component.html'
})

export class ElementRevisionRefComponent implements AfterViewInit, OnChanges {
  @Input() elementRevisions: ElementRevisionRef[];
  @Input() selectOptions: ISelectOption[];
  @Input() readonly = false;
  @Input() showIcon = true;
  @Input() xmlLang = 'none';
  @Input() inParameters: Map<string, Parameter>
  @Output() actionEvent = new EventEmitter<EventAction>();

  public showLabel = new Map<string, boolean>();
  public selectedElementKind = 0;
  public SOURCE: IElement | IRevisionRef | null;
  public deleteIndex = -1;
  private _modalRef: M.Modal;
  private _showButton = false;
  private action = ActionKind.Create;

  public readonly modalId = Math.round(Math.random() * 10000);
  public readonly isControlConstruct = (ref: ElementRevisionRef): boolean => [4, 5, 6].includes(getElementKind(ref.elementKind).valueOf());

  constructor(private service: TemplateService, public message: MessageService, private router: Router) {
  }

  get modalRef(): M.Modal {
    if (!(this._modalRef)) {
      this._modalRef = M.Modal.init(document.querySelector('#MODAL-' + this.modalId),
        {
          inDuration: 750, outDuration: 1000, startingTop: '50%', endingTop: '10%', preventScrolling: true, opacity: 0.3
        });
    }
    return this._modalRef;
  }

  get showButton(): boolean {
    return this._showButton;
  }
  set showButton(value: boolean) {
    this._showButton = value;
  }

  public ngOnChanges(changes: SimpleChanges): void { }

  public ngAfterViewInit(): void {
    M.Collapsible.init(document.querySelectorAll('.collapsible'));
  }

  public onItemDrop(event: CdkDragDrop<any[]>) {
    if (event.previousContainer === event.container) {
      // console.log('moving');
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    }
  }

  public onOpenBody(item: ElementRevisionRef) {

    if (!item.element) {
      const kind = getElementKind(item.elementKind);
      this.service.getByKindRevision(
        kind,
        item.elementId,
        item.elementRevision)
        .then((result) => {
          // console.log('create from seed');
          item.element = Factory.createFromSeed(kind, result.entity);
          item.version = result.entity.version;
          this.actionEvent.emit({ action: ActionKind.Read, ref: item });
        });
    } else {
      this.actionEvent.emit({ action: ActionKind.Read, ref: item });
    }
  }

  public getMatIcon(kind: ElementKind): string {
    return getIcon(kind);
  }

  // -------------------------------------------------------------------
  public onSelectElementKind(kind) {
    this.SOURCE = { element: '', elementKind: kind };
    // console.log(this.SOURCE);
  }

  public revisionSelectedEvent(ref: ElementRevisionRef) {
    this.actionEvent.emit({ action: this.action, ref });
    this.SOURCE = null;
    this.modalRef.close();
  }

  public onDismiss(event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    this.SOURCE = null;
    this.modalRef.close();
  }

  public onItemNew(event: Event) {
    event.stopPropagation();
    this.action = ActionKind.Create;
    this.modalRef.open();
  }

  public onItemRemove(ref: ElementRevisionRef) {
    if (ref) {
      ref.index = this.deleteIndex;
      this.actionEvent.emit({ action: ActionKind.Delete, ref });
    }
  }

  public onItemEdit(event: Event, cqi: ElementRevisionRef) {
    event.stopPropagation();
    this.service.searchByUuid(cqi.elementId).then(
      (result) => { this.router.navigate([result.url]); },
      (error) => { throw error; });
  }

  public onItemUpdate(event: Event, cqi: ElementRevisionRef) {
    event.stopPropagation();
    this.action = ActionKind.Update;
    this.SOURCE = cqi;
    this.modalRef.open();
  }

  public onCheckParams(id, event) {
    console.log(id);
    // console.log(event);
    // console.log(this.inParameters.get(id).value);
    // this.inParameters.get(id).value = event;
  }
  // -------------------------------------------------------------------

}
