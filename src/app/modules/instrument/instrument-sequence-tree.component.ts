import { Component, Input, EventEmitter, Output, OnChanges, SimpleChanges } from '@angular/core';
import {
  HEADER_DETAILS,
  ElementKind,
  ElementRevisionRef,
  IElement,
  IRevisionRef,
  getElementKind, InstrumentSequence, getIcon, TemplateService, CONSTRUCT_MAP, ActionKind, MessageService
} from '../../lib';



@Component({
  selector: 'qddt-instrument-sequence-tree',
  styles: [
    'ul { padding: 1px; border: 0; }',
    '.collapsible-header {padding: 0.75rem; }',
    '.collapsible-header:hover > ul.dropleft { display:block; }',
  ],
  templateUrl: './instrument-sequence-tree.component.html'
})

export class InstrumentSequenceTreeComponent {
  @Input() subSequence: InstrumentSequence[];
  @Input() readonly = false;
  @Input() level = 0;
  @Output() actionEvent = new EventEmitter<{ action: ActionKind, ref: ElementRevisionRef }>();

  public readonly modalId = Math.round(Math.random() * 10000);
  public readonly selectOptions = CONSTRUCT_MAP;
  public readonly SEQUENCE = ElementKind.SEQUENCE_CONSTRUCT;
  public selectId = 0;
  public SOURCE: IElement | IRevisionRef | null;
  // tslint:disable-next-line:variable-name
  private _showButton = false;
  private action = ActionKind.Create;

  constructor(private service: TemplateService, public message: MessageService) {

  }

  get showButton(): boolean {
    return this._showButton;
  }
  set showButton(value: boolean) {
    // if (value) {
    //   this._ShowRef = true;
    // }
    this._showButton = value;
  }

  ngAfterViewInit(): void {

    var elems = document.querySelectorAll('.collapsible');
    M.Collapsible.init(elems);
    (document.getElementById('UL-' + this.modalId) as HTMLElement).style.marginLeft = this.level + 'rem';
  }


  public onRevisionSelect(ref: ElementRevisionRef) {
    const insSeq = new InstrumentSequence();
    insSeq.elementRef = ref;
    ref.element.sequence.forEach((seq: ElementRevisionRef) => {
      const newSeq = new InstrumentSequence();
      newSeq.elementRef = seq;
      insSeq.sequence.push(newSeq);
    });
    console.log(insSeq || JSON);
    this.subSequence.push(insSeq);
  }

  public onDeleteItem(idx) {
    this.subSequence.splice(idx, 1);
  }

  public onDismiss() {
    console.log('dissmiss');
  }

  public onOpenBody(item: InstrumentSequence) {
    // sequence.forEach((item) => {
    if (!item.elementRef.element && !this.isSequence(item.elementRef.elementKind)) {
      this.service.getByKindRevision(
        getElementKind(item.elementRef.elementKind),
        item.elementRef.elementId,
        item.elementRef.elementRevision)
        .then((result) => {
          item.elementRef.element = result.entity;
          item.elementRef.version = result.entity.version;
        });
    }
    // });

  }

  public isSequence(kind: ElementKind | string): boolean {
    return getElementKind(kind) === this.SEQUENCE;
  }

  public onItemNew(event: Event, ref?: ElementRevisionRef) {
    event.stopPropagation();
    this.action = ActionKind.Create;
  }

  public onItemRemove(event: Event, ref: ElementRevisionRef) {
    event.stopPropagation();
    this.actionEvent.emit({ action: ActionKind.Delete, ref });
  }

  public onItemUpdate(event: Event, cqi: ElementRevisionRef) {
    event.stopPropagation();
    this.action = ActionKind.Update;
    this.SOURCE = cqi;
  }

  public onItemPreview(event: Event, item: ElementRevisionRef) {
    event.stopPropagation();
    this.message.sendMessage(item);
  }

  public onSelectOption(value) {
    this.SOURCE = { element: '', elementKind: value };
    console.log(this.SOURCE);
  }

  public getMatIcon(kind: ElementKind): string {
    return getIcon(kind);
  }

}
