import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import {
  ActionKind,
  ElementKind,
  Instrument,
  INSTRUMENT_KIND,
  InstrumentKind,
  LANGUAGE_MAP,
  TemplateService, InstrumentSequence
} from '../../lib';

@Component({
  selector: 'qddt-instrument-form',

  templateUrl: './instrument.form.component.html',
})

export class InstrumentFormComponent implements OnChanges {
  @Output() modifiedEvent = new EventEmitter<Instrument>();
  @Input() readonly = false;
  @Input() element: Instrument;

  public formId = Math.round(Math.random() * 10000);
  public currentInstrumentType = InstrumentKind.QUESTIONNAIRE;
  public readonly instrumentKinds = INSTRUMENT_KIND;
  public readonly LANGUAGES = LANGUAGE_MAP;
  private _modalRef : M.Modal;

  constructor(private service: TemplateService) {
    this.readonly = !this.service.can(ActionKind.Create, ElementKind.INSTRUMENT);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.element.currentValue) {
      this.currentInstrumentType = InstrumentKind[this.element.instrumentKind];
    }
    // try { M.updateTextFields(); } catch (Exception) { }
  }

  public onSelectInstrumentType(value: InstrumentKind) {
    this.element.instrumentKind = InstrumentKind[value];
  }

  public onUpdateInstrument() {
    console.log(this.element);
    this.service.update<Instrument>(this.element).subscribe(
      (result) => {
        console.log(result);
        this.element = result;
        this.modifiedEvent.emit(result);
      },
      (error) => { throw error; });
  }

  public getDescription(value: string): string {
    return this.instrumentKinds.find( pre => pre.value === value).description;
  }

  get modalRef(): M.Modal {
    if (!(this._modalRef)) {
      this._modalRef = M.Modal.init(document.querySelector('#MODAL-' + this.formId));
    }
    return this._modalRef;
  }

  public onDoAction( response) {
    const action = response.action as ActionKind;
    const ref = response.ref as InstrumentSequence;
    switch (action) {
      case ActionKind.Create: this.onItemAdded(ref); break;
      case ActionKind.Delete: this.onItemRemoved(ref); break;
      case ActionKind.Update: this.onItemModified(ref); break;
      default: {
        console.error('wrong action recieved ' + ActionKind[action]);
      }
    }
  }

  public onItemRemoved(ref: InstrumentSequence) {
    console.log('onItemRemoved -> ' + ref || JSON);
    this.element.sequence =
      this.element.sequence.filter(f => !(f.id === ref.id ));
  }

  public onItemAdded(ref: InstrumentSequence) {
    console.log('onItemAdded -> ' + ref || JSON);
    this.element.sequence.push(ref);
  }

  public onItemModified(ref: InstrumentSequence) {
    console.log('onItemModified -> ' + ref || JSON);
    const idx = this.element.sequence.findIndex(f => f.id === ref.id  );
    const seqNew: InstrumentSequence[] = [].concat(
      this.element.sequence.slice(0, idx ),
      ref,
      this.element.sequence.slice(idx + 1)
    );
    this.element.sequence = seqNew;
  }

}
