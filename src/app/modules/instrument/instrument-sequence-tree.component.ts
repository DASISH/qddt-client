import {AfterContentInit, Component, EventEmitter, Input, Output} from '@angular/core';
import {
  ActionKind,
  ElementKind, ElementRevisionRef, EventAction,
  getElementKind,
  getIcon,
  InstrumentSequence,
  TemplateService
} from '../../lib';


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

export class InstrumentSequenceTreeComponent implements AfterContentInit {
  @Input() subSequence: InstrumentSequence[];
  @Input() readonly = false;
  @Input() level = 0;
  @Output() actionEvent = new EventEmitter<{ action: ActionKind, ref: InstrumentSequence }>();
  // @Output() actionEvent = new EventEmitter<EventAction>();

  // tslint:disable-next-line:variable-name
  private _showButton = false;

  constructor(private service: TemplateService) {
    this.readonly = !service.can(ActionKind.Create, ElementKind.INSTRUMENT);
  }

  get showButton(): boolean {
    return this._showButton;
  }
  set showButton(value: boolean) {

    this._showButton = value;
  }

  public ngAfterContentInit(): void {
      M.Collapsible.init(document.querySelectorAll('.collapsible'));
  }

  public onItemNew(event: Event, ref: InstrumentSequence) {
    // console.log('onItemNew');
    this.actionEvent.emit( { action: ActionKind.Create,  ref });
    event.stopPropagation();
  }

  public onItemRemove(event: Event, ref: InstrumentSequence) {
    // console.log('onItemRemove');
    this.actionEvent.emit({ action: ActionKind.Delete,  ref });
    event.stopPropagation();
  }

  public onItemEdit(event: Event, ref: InstrumentSequence) {
    // console.log('onItemEdit');
    this.actionEvent.emit( { action: ActionKind.Read,  ref });
    event.stopPropagation();
  }

  public onItemUpdate(event: Event, ref: InstrumentSequence) {
    // console.log('onItemUpdate');
    this.actionEvent.emit( { action: ActionKind.Update,  ref });
    event.stopPropagation();
  }

  public doPassEvent(response) {
      // console.log(response || JSON);
      // const action = response.action as ActionKind;
      // const ref = response.ref as InstrumentSequence;
      this.actionEvent.emit( response);
  }

  public onOpenBody(item: InstrumentSequence) {

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
  }

  public isSequence(kind: ElementKind | string): boolean {
    return getElementKind(kind) === ElementKind.SEQUENCE_CONSTRUCT;
  }

  public getMatIcon(kind: ElementKind): string {
    return getIcon(kind);
  }

}
