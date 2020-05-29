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
  TemplateService
} from '../../lib';
import { toArray } from 'rxjs/operators';

@Component({
  selector: 'qddt-instrument-form',
  templateUrl: './instrument.form.component.html',
})

export class InstrumentFormComponent implements OnChanges {
  @Output() modifiedEvent = new EventEmitter<Instrument>();
  @Input() readonly = false;
  @Input() element: Instrument;

  public formId = Math.round(Math.random() * 10000);
  public selectId = 0;
  public currentInstrumentType = InstrumentKind.QUESTIONNAIRE;
  public SOURCE: IElement | IRevisionRef | null;
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
    if (changes.element && changes.element.currentValue) {
      this.element = new Instrument(changes.element.currentValue);
      this.currentInstrumentType = InstrumentKind[this.element.instrumentKind];
      this.service.canDoAction(ActionKind.Update, this.element)
        .then(can => this.readonly = !can);

    }
    if (this.element && this.element.parameters) {
      console.log(this.element.parameters || JSON);
    }
    // try { M.updateTextFields(); } catch (Exception) { }
  }

  public onUpdateInstrument() {
    this.service.update<Instrument>(this.element).subscribe(
      (result) => {
        this.element = result;
        this.modifiedEvent.emit(result);
      },
      (error) => { throw error; });
  }

  public onRevisionSelect(ref: ElementRevisionRef) {
    this.element.sequence.push(
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
      case ActionKind.Read: break;
      case ActionKind.Create: this.onItemAdded(ref); break;
      case ActionKind.Update: this.onItemModified(ref); break;
      case ActionKind.Delete: this.onItemRemoved(ref); break;
      default: {
        console.error('wrong action recieved ' + ActionKind[action]);
      }
    }
  }

  public onItemRemoved(ref: InstrumentSequence) {
    const tmp = this.element.sequence.filter(f => !(f.id === ref.id));
    this.element.sequence = null;
    this.element.sequence = tmp;
  }

  public onItemAdded(ref: InstrumentSequence) {
    console.log(ref || JSON);
    this.modalRef.open();
    // this.element.sequence.push(ref);
  }

  public onItemModified(ref: InstrumentSequence) {
    console.log(ref || JSON);
    const idx = this.element.sequence.findIndex(f => f.id === ref.id);
    const seqNew: InstrumentSequence[] = [].concat(
      this.element.sequence.slice(0, idx),
      ref,
      this.element.sequence.slice(idx + 1)
    );
    this.element.sequence = seqNew;
  }

}

