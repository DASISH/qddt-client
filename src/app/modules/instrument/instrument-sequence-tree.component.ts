import { AfterViewInit, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import {
  ActionKind, ElementKind, getElementKind, getIcon,
  TemplateService, isAbstractControlConstruct, ElementRevisionRefImpl,
  SequenceConstruct, AbstractControlConstruct, Parameter, InstrumentElement
} from '../../lib';
import { Factory } from './../../lib/factory';

@Component({
  selector: 'qddt-instrument-sequence-tree',
  styles: [
    'ul.collapsible { padding: 1px; border: 0; margin-top:0; margin-bottom: 0; }',
    'ul.collapsible  ul.collapsible {  margin-left: 1rem; }',
    '.collapsible-header {padding: 0.75rem; }',
    '.collapsible-header:hover > ul.dropleft { display:block; }',
  ],
  templateUrl: './instrument-sequence-tree.component.html'
})

export class InstrumentSequenceTreeComponent implements AfterViewInit, OnChanges {
  @Input() subSequence: InstrumentElement[];
  @Input() readonly = false;
  @Input() level = 0;
  @Input() xmlLang: string;
  @Input() inParameters: Map<string, Parameter>;
  @Output() actionEvent = new EventEmitter<{ action: ActionKind, ref: InstrumentElement }>();

  // tslint:disable-next-line:variable-name
  private _showButton = false;

  constructor(private service: TemplateService) {
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

  public onItemNew(event: Event, ref?: InstrumentElement) {
    event.stopPropagation();
    this.actionEvent.emit({ action: ActionKind.Create, ref });
  }

  public onItemRemove(event: Event, ref: InstrumentElement) {
    this.actionEvent.emit({ action: ActionKind.Delete, ref });
    event.stopPropagation();
  }

  public onItemEdit(event: Event, ref: InstrumentElement) {
    this.actionEvent.emit({ action: ActionKind.Read, ref });
    event.stopPropagation();
  }

  public onItemUpdate(event: Event, ref: InstrumentElement) {
    this.actionEvent.emit({ action: ActionKind.Update, ref });
    event.stopPropagation();
  }

  public doPassEvent(response) {
    this.actionEvent.emit(response);
  }

  public async onOpenBody(item: InstrumentElement) {
    if (!item.element && !this.isSequenceKind(item.elementKind)) {
      item = new InstrumentElement(await this.getCtrlRevRefAsync(item));
    }
  }


  public getMatIcon(kind: ElementKind): string {
    return getIcon(kind);
  }

  public getCtrlRevRefAsync = async (item: ElementRevisionRefImpl<AbstractControlConstruct>) => {
    if (!item.element) {
      const kind = getElementKind(item.elementKind);
      const result = await this.service.getByKindRevision(kind, item.elementId, item.elementRevision);
      const element = Factory.createFromSeed(kind, result.entity);
      item.element = isAbstractControlConstruct(element) ? element : null;
      if (this.isSequence(item.element)) {
        const sequencePromises = item.element.sequence
          .map(async (child, _i) =>
            (getElementKind(child.elementKind) === ElementKind.SEQUENCE_CONSTRUCT) ?
              await this.getCtrlRevRefAsync(child) :
              await Promise.resolve(child));
        console.log('get await');
        item.element.sequence = await Promise.all(sequencePromises);
      }
    };
    return await Promise.resolve(item);
  }

  public isSequence(element?: any | SequenceConstruct): element is SequenceConstruct {
    return (element) && (element as SequenceConstruct).sequence !== undefined;
  }

  public isSequenceKind(kind: ElementKind | string): boolean {
    return getElementKind(kind) === ElementKind.SEQUENCE_CONSTRUCT;
  }
}
