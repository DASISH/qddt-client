import { Component, Input, Output, EventEmitter } from '@angular/core';
import { InstrumentService, Instrument } from './instrument.service';

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
  controlConstructsActions = new EventEmitter<string>();
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
    this.controlConstructsActions.emit('openModal');
  }

  onClickControlConstruct(id: number) {
    this.selectedControlConstruct = this.instrument.controlConstructs[id];
    this.controlConstructsActions.emit('openModal');
  }

  onUpdateInstrument() {
    this.service.update(this.instrument).subscribe((result: any) => {
        let index = this.instruments.findIndex((e:any) => e.id === result.id);
        if(index >= 0) {
          this.instruments[index] = result;
        }
        this.hideDetail();
      }, (error: any) => {
        console.log(error);
      });
  }
}
