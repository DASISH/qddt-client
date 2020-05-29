import { filter } from 'rxjs/operators';
import { AfterViewInit, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { ActionKind, ElementKind, getElementKind, getIcon, InstrumentSequence, Parameter, TemplateService } from '../../lib';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

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
  @Input() subSequence: InstrumentSequence[];
  @Input() readonly = false;
  @Input() level = 0;
  @Input() xmlLang = 'none';
  @Output() actionEvent = new EventEmitter<{ action: ActionKind, ref: InstrumentSequence }>();

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

  public onItemNew(event: Event, ref: InstrumentSequence) {
    this.actionEvent.emit({ action: ActionKind.Create, ref });
    event.stopPropagation();
  }

  public onItemRemove(event: Event, ref: InstrumentSequence) {
    this.actionEvent.emit({ action: ActionKind.Delete, ref });
    event.stopPropagation();
  }

  public onItemEdit(event: Event, ref: InstrumentSequence) {
    this.actionEvent.emit({ action: ActionKind.Read, ref });
    event.stopPropagation();
  }

  public onItemUpdate(event: Event, ref: InstrumentSequence) {
    this.actionEvent.emit({ action: ActionKind.Update, ref });
    event.stopPropagation();
  }

  public doPassEvent(response) {
    // console.log(response || JSON);
    // const action = response.action as ActionKind;
    // const ref = response.ref as InstrumentSequence;
    this.actionEvent.emit(response);
  }

  public onOpenBody(item: InstrumentSequence) {
    const ref = item.elementRef;
    if (!ref.element && !this.isSequence(ref.elementKind)) {
      this.service.getByKindRevision(getElementKind(ref.elementKind), ref.elementId, ref.elementRevision)
        .then((result) => {
          ref.element = result.entity;
          ref.version = result.entity.version;
          item = new InstrumentSequence(item);
        });
    }
  }

  public isSequence(kind: ElementKind | string): boolean {
    return getElementKind(kind) === ElementKind.SEQUENCE_CONSTRUCT;
  }

  public getMatIcon(kind: ElementKind): string {
    return getIcon(kind);
  }

  public getParam(param: Parameter): string {
    if (param.referencedId) {
      return (param.value || '?') + '➫' + param.name;
    } else {
      return param.name + '➫' + (param.value || '?');
    }
  }
}
