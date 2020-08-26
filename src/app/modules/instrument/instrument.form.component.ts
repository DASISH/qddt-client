import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import {
  ActionKind,
  CONSTRUCT_MAP,
  IElement,
  Instrument,
  INSTRUMENT_MAP,
  InstrumentKind,
  IRevisionRef,
  LANGUAGE_MAP,
  TemplateService,
  SequenceConstruct,
  SEQUENCE_TYPES,
  TreeNodeRevisionRefImpl, TreeNodeRevisionRef, hasChanges, replaceNode
} from '../../lib';

@Component({
  selector: 'qddt-instrument-form',
  templateUrl: './instrument.form.component.html',
})

export class InstrumentFormComponent implements OnChanges {
  @Output() modifiedEvent = new EventEmitter<Instrument>();
  @Input() readonly = false;
  @Input() instrument: Instrument;

  public formId = Math.round(Math.random() * 10000);
  public selectId = 0;
  public currentInstrumentType = InstrumentKind.QUESTIONNAIRE;
  public SOURCE: IElement | IRevisionRef | null;
  public readonly CONSTRUCT = SEQUENCE_TYPES;

  public readonly instrumentMap = INSTRUMENT_MAP;
  public readonly languageMap = LANGUAGE_MAP;
  public readonly constructMap = CONSTRUCT_MAP;

  // tslint:disable-next-line:variable-name
  private _modalRef: M.Modal;

  constructor(private service: TemplateService) {
  }

  get modalRef(): M.Modal {
    if (!(this._modalRef)) {
      this._modalRef = M.Modal.init(document.querySelector('#MODAL-' + this.formId));
    }
    return this._modalRef;
  }

  public getDescription(value: string): string {
    return this.instrumentMap.find(pre => pre.value === value).description;
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (hasChanges(changes.instrument)) {
      this.instrument = new Instrument(JSON.parse(JSON.stringify(changes.instrument.currentValue)));
      this.currentInstrumentType = InstrumentKind[this.instrument.instrumentKind];
      this.service.canDoAction(ActionKind.Update, this.instrument)
        .then(can => this.readonly = !can);
    }
  }

  public onUpdateInstrument() {
    this.service.update<Instrument>(this.instrument).subscribe(
      (result) => {
        this.instrument = result;
        this.modifiedEvent.emit(result);
      },
      (error) => { throw error; });
  }

  public onRevisionSelect(ref: TreeNodeRevisionRef) {
    this.instrument.root.children.push(new TreeNodeRevisionRefImpl(ref));
  }

  public onSelectOption(value) {
    this.SOURCE = { element: '', elementKind: value };
    console.log(this.SOURCE);
  }

  public onOpen() {
    this.modalRef.open();
  }

  public onDismiss() {
    this.modalRef.close();
  }

  public onDoAction(response: { action: ActionKind; ref: TreeNodeRevisionRef }) {
    const action = response.action as ActionKind;
    const ref = response.ref as TreeNodeRevisionRef;
    switch (action) {
      case ActionKind.Read:
        console.log(replaceNode(this.instrument.root.children, ref));
        break;
      case ActionKind.Create: this.onItemAdded(ref); break;
      case ActionKind.Update: this.onItemModified(ref); break;
      case ActionKind.Delete: this.onItemRemoved(ref); break;
      default: {
        console.error('wrong action recieved ' + ActionKind[action]);
      }
    }
    // this.instrument.initParameters();
  }

  public onItemRemoved(ref: TreeNodeRevisionRef) {
    const tmp = this.instrument.root.children.filter(f => !(f.id === ref.id));
    this.instrument.root.children = null;
    this.instrument.root.children = tmp;
  }

  public onItemAdded(ref: TreeNodeRevisionRef) {
    // console.log('onItemAdded');

    this.instrument.root.children.push(ref);
  }

  public onItemModified(ref: TreeNodeRevisionRef) {
    console.log('onItemModified');
    const idx = this.instrument.root.children.findIndex(f => f.elementId === ref.elementId);
    const seqNew: TreeNodeRevisionRef[] = [].concat(
      this.instrument.root.children.slice(0, idx),
      ref,
      this.instrument.root.children.slice(idx + 1)
    );
    this.instrument.root.children = seqNew;
  }



  public isSequence(entity?: any | SequenceConstruct): entity is SequenceConstruct {
    return (entity) && (entity as SequenceConstruct).sequence !== undefined;
  }



}

