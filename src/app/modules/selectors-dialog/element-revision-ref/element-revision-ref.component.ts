import { AfterViewInit, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {
  ActionKind,
  ElementKind,
  getElementKind,
  getIcon,
  ElementRevisionRef,
  TemplateService,
  EventAction,
  InstrumentSequence
} from '../../../lib';


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
  @Input() readonly = false;
  @Output() actionEvent = new EventEmitter<EventAction>();

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

  public onItemNew(event: Event, ref: ElementRevisionRef) {
    this.actionEvent.emit(new EventAction({ action: ActionKind.Create, ref }));
    event.stopPropagation();
  }

  public onItemRemove(event: Event, ref: ElementRevisionRef) {
    this.actionEvent.emit(new EventAction({ action: ActionKind.Delete, ref }));
    event.stopPropagation();
  }

  public onItemEdit(event: Event, ref: ElementRevisionRef) {
    this.actionEvent.emit(new EventAction({ action: ActionKind.Read, ref }));
    event.stopPropagation();
  }

  public onItemUpdate(event: Event, ref: ElementRevisionRef) {
    this.actionEvent.emit(new EventAction({ action: ActionKind.Update, ref }));
    event.stopPropagation();
  }

  // public onDoAction(response: { action: ActionKind; ref: InstrumentSequence; }) {
  //   const action = response.action as ActionKind;
  //   const ref = response.ref as InstrumentSequence;
  //   switch (action) {
  //     case ActionKind.Read: break;
  //     case ActionKind.Create: this.onItemAdded(ref); break;
  //     case ActionKind.Update: this.onItemModified(ref); break;
  //     case ActionKind.Delete: this.onItemRemoved(ref); break;
  //     default: {
  //       console.error('wrong action recieved ' + ActionKind[action]);
  //     }
  //   }
  // }
  //
  // public onItemRemoved(ref: InstrumentSequence) {
  //   const tmp = this.element.sequence.filter(f => !(f.id === ref.id));
  //   this.element.sequence = null;
  //   this.element.sequence = tmp;
  // }
  //
  // public onItemAdded(ref: InstrumentSequence) {
  //   console.log(ref || JSON);
  //   this.modalRef.open();
  //   // this.element.sequence.push(ref);
  // }
  //
  // public onItemModified(ref: InstrumentSequence) {
  //   console.log(ref || JSON);
  //   const idx = this.element.sequence.findIndex(f => f.id === ref.id);
  //   const seqNew: InstrumentSequence[] = [].concat(
  //     this.element.sequence.slice(0, idx),
  //     ref,
  //     this.element.sequence.slice(idx + 1)
  //   );
  //   this.element.sequence = seqNew;
  // }
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

}
