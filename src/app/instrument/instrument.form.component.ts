import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { TemplateService } from '../template/template.service';
import { IEntityEditAudit } from '../shared/classes/interfaces';
import { Instrument, INSTRUMENT_KIND, InstrumentKind } from './instrument.classes';
import {ActionKind, ElementKind} from '../shared/classes/enums';

declare var Materialize: any;

@Component({
  selector: 'qddt-instrument-form',
  moduleId: module.id,
  templateUrl: './instrument.form.component.html',
})

export class InstrumentFormComponent implements OnChanges {
  @Output() modifiedEvent = new EventEmitter<IEntityEditAudit>();
  @Input() readonly = false;
  @Input() element: Instrument;

  public formId = Math.round( Math.random() * 10000);
  public currentInstrumentType = InstrumentKind.QUESTIONNAIRE;
  public instrumentKinds = INSTRUMENT_KIND;

  constructor(private service: TemplateService) {
    this.readonly = !this.service.can(ActionKind.Create, ElementKind.INSTRUMENT);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['element'].currentValue) {
      this.currentInstrumentType = InstrumentKind[this.element.instrumentKind];
    }
    try { Materialize.updateTextFields(); } catch (Exception) { }
  }

  public onSelectInstrumentType(value: InstrumentKind) {
    this.element.instrumentKind = InstrumentKind[value];
  }

  public onUpdateInstrument() {
    console.log(this.element);
    this.service.update(this.element).subscribe(
      (result) => {
          console.log(result);
          this.element = result;
          this.modifiedEvent.emit(result); },
      (error) => { throw error; });
  }
}
