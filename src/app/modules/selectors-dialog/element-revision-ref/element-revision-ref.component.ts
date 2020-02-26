import { AfterViewInit, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import {
  ActionKind,
  ElementKind, ElementRevisionRef, EventAction,
  getElementKind, getIcon,
  IElement, IRevisionRef, ISelectOption,
  MessageService,
  TemplateService
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
  @Output() actionEvent = new EventEmitter<EventAction>();

  public readonly modalId = Math.round(Math.random() * 10000);

  public selectedElementKind = 0;
  public SOURCE: IElement | IRevisionRef | null;
  // tslint:disable-next-line:variable-name
  private _modalRef: M.Modal;
  // tslint:disable-next-line:variable-name
  private _showButton = false;
  private action = ActionKind.Create;

  constructor(private service: TemplateService, public message: MessageService, private router: Router) {
  }

  get modalRef(): M.Modal {
    if (!(this._modalRef)) {
      this._modalRef = M.Modal.init(document.querySelector('#MODAL-' + this.modalId));
    }
    return this._modalRef;
  }

  get showButton(): boolean {
    return this._showButton;
  }
  set showButton(value: boolean) {
    this._showButton = value;
  }

  public ngOnChanges(changes: SimpleChanges): void {
    // console.log(changes || JSON);
    // if (changes.subSequence.currentValue) {
    // }
  }

  public ngAfterViewInit(): void {
    M.Collapsible.init(document.querySelectorAll('.collapsible'));
  }

  public onItemDrop(event: CdkDragDrop<any[]>) {
    if (event.previousContainer === event.container) {
      console.log('moving');
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    }
  }

  public onOpenBody(item: ElementRevisionRef) {

    if (!item.element) {
      this.service.getByKindRevision(
        getElementKind(item.elementKind),
        item.elementId,
        item.elementRevision)
        .then((result) => {
          item.element = result.entity;
          item.version = result.entity.version;
        });
    }
  }

  public getMatIcon(kind: ElementKind): string {
    return getIcon(kind);
  }

  // -------------------------------------------------------------------
  public onSelectElementKind(kind) {
    this.SOURCE = { element: '', elementKind: kind };
    console.log(this.SOURCE);
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

  public onItemRemove(event: Event, ref: ElementRevisionRef) {
    event.stopPropagation();
    this.actionEvent.emit({ action: ActionKind.Delete, ref });
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

  // -------------------------------------------------------------------

}
