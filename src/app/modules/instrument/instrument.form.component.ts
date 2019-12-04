import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { ActionKind, ElementKind, Instrument, INSTRUMENT_KIND, InstrumentKind, enumLANGUAGES, StringIsNumber } from '../../lib';
import { TemplateService } from '../../components/template';
import { LanguageKind } from '../../lib/enums/language-kind';



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
  public readonly instrumentKinds;
  public readonly LANGUAGES = LanguageKind;

  constructor(private service: TemplateService) {
    this.readonly = !this.service.can(ActionKind.Create, ElementKind.INSTRUMENT);
    this.instrumentKinds = Object.keys( INSTRUMENT_KIND )
    .filter(StringIsNumber)
    .filter(f => f !== '0')
    .map(key => (InstrumentKind[key] as string));
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
}
