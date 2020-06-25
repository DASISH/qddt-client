import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import {
  ActionKind,
  CONSTRUCT_MAP,
  ElementRevisionRef,
  IElement,
  Instrument,
  INSTRUMENT_MAP,
  InstrumentKind,
  InstrumentSequence,
  IRevisionRef,
  LANGUAGE_MAP,
  TemplateService,
  Parameter
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
  public inParameters = new Map<string, Parameter>();
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
    if (changes.instrument && changes.instrument.currentValue) {
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

  public onRevisionSelect(ref: ElementRevisionRef) {
    this.instrument.sequence.push(
      new InstrumentSequence({
        elementRef: ref,
        sequence: (ref.element.sequence) ? ref.element.sequence : []
          .map((isref: ElementRevisionRef) => new InstrumentSequence({ elementRef: isref }))
      }));
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

  public onDoAction(response: { action: ActionKind; ref: InstrumentSequence; }) {
    const action = response.action as ActionKind;
    const ref = response.ref as InstrumentSequence;
    switch (action) {
      case ActionKind.Read: this.onSetParameters(ref); break;
      case ActionKind.Create: this.onItemAdded(ref); break;
      case ActionKind.Update: this.onItemModified(ref); break;
      case ActionKind.Delete: this.onItemRemoved(ref); break;
      default: {
        console.error('wrong action recieved ' + ActionKind[action]);
      }
    }
  }

  public onItemRemoved(ref: InstrumentSequence) {
    const tmp = this.instrument.sequence.filter(f => !(f.id === ref.id));
    this.instrument.sequence = null;
    this.instrument.sequence = tmp;
  }

  public onItemAdded(ref: InstrumentSequence) {
    console.log('ref || JSON');
    this.modalRef.open();
    // this.instrument.sequence.push(ref);
  }

  public onItemModified(ref: InstrumentSequence) {
    // console.log(ref || JSON);
    const idx = this.instrument.sequence.findIndex(f => f.id === ref.id);
    const seqNew: InstrumentSequence[] = [].concat(
      this.instrument.sequence.slice(0, idx),
      ref,
      this.instrument.sequence.slice(idx + 1)
    );
    this.instrument.sequence = seqNew;
  }

  private onSetParameters(ref: InstrumentSequence) {
    if (this.isSequence(ref.elementRef.element)) {
      this.inParameters = new Map(ref.elementRef.element.parameters.map((p) => [p.id, p] as [string, Parameter]));
    }
  }

  public isSequence(instrument?: any | SequenceConstruct): instrument is SequenceConstruct {
    return (instrument) && (instrument as SequenceConstruct).sequence !== undefined;
  }

}

