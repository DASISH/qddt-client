import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, Inject } from '@angular/core';
import { MaterializeAction } from 'angular2-materialize';
import { IEntityEditAudit } from '../shared/elementinterfaces/entityaudit';
import { Factory } from '../shared/elementfactory/factory';
import { ElementKind } from '../shared/elementinterfaces/elements';
import { InstrumentDetailComponent } from './instrument.detail.component';
import { InstrumentKind, INSTRUMENT_KIND, Instrument } from './instrument.classes';
import { TemplateService } from '../template/template.service';

declare var Materialize: any;

@Component({
  selector: 'qddt-instrument-form',
  moduleId: module.id,
  templateUrl: './instrument.form.component.html',
})

export class InstrumentFormComponent implements OnChanges {
  @Output() modifiedEvent = new EventEmitter<IEntityEditAudit>();
  @Input() element: Instrument;

  public formId = Math.round( Math.random() * 10000);
  public currentInstrumentType = InstrumentKind.QUESTIONNAIRE;
  public instrumentKinds = INSTRUMENT_KIND;

  constructor(private service: TemplateService) {
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
    this.service.update(this.element).subscribe(
      (result) => {
        if (this.modifiedEvent) {this.modifiedEvent.emit(result); } },
      (error) => { throw error; });
  }
}
