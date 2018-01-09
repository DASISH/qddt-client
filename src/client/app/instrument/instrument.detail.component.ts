import { Component, Input, Output, EventEmitter } from '@angular/core';
import { InstrumentService, Instrument } from './instrument.service';
import { MaterializeAction } from 'angular2-materialize';

@Component({
  selector: 'qddt-instrument-detail',
  moduleId: module.id,
  templateUrl: './instrument.detail.component.html',
  providers: [InstrumentService],
})

export class InstrumentDetailComponent {
  @Input() instrument: Instrument;
  @Input() instruments: Instrument[];
  @Input() isVisible: boolean;
  @Output() hideDetailEvent: EventEmitter<String> = new EventEmitter<String>();
  controlConstructsActions = new EventEmitter<string|MaterializeAction>();
  private revisionIsVisible: boolean;
  private selectedControlConstruct: any;

  constructor(private service: InstrumentService) {
    this.revisionIsVisible = false;
  }

  hideDetail() {
    this.hideDetailEvent.emit('hide');
  }

  onDeleteControlConstruct(id: number) {
    this.instrument.controlConstructs.splice(id, 1);
  }

  onAddControlConstruct() {
    //this.instrument.controlConstructs.push(c);
    this.controlConstructsActions.emit({action: 'modal', params: ['open']});
    // this.controlConstructsActions.emit({action:'modal', params:['open']});
  }

  onClickControlConstruct(id: number) {
    this.selectedControlConstruct = this.instrument.controlConstructs[id];
    this.controlConstructsActions.emit({action: 'modal', params: ['open']});
    // this.controlConstructsActions.emit({action:'modal', params:['open']});
  }

  onUpdateInstrument() {
    this.service.update(this.instrument).subscribe((result: any) => {
        const index = this.instruments.findIndex((e: any) => e.id === result.id);
        if (index >= 0) {
          this.instruments[index] = result;
        }
        this.hideDetail();
      }, (error: any) => {
        console.log(error);
      });
  }
}
