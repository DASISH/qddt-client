import { Component, OnInit, EventEmitter } from '@angular/core';
import { InstrumentService, Instrument } from './instrument.service';
import { MaterializeAction } from 'angular2-materialize';

@Component({
  selector: 'qddt-instrument',
  moduleId: module.id,
  templateUrl: './instrument.component.html',
  styles: [
    `.noItemFound {
        border: thick solid red;
    }`
  ],
  providers: [InstrumentService],
})
export class InstrumentComponent implements OnInit {

  showInstrumentForm = false;
  modalActions = new EventEmitter<string|MaterializeAction>();
  error: any;

  private instruments: any[];
  private page: any;
  private instrument: any;
  private searchKeys: string;
  private selectedInstrument: any;
  private isDetail: boolean;
  private columns: any[];

  constructor(private service: InstrumentService) {
    this.isDetail = false;
    this.instruments = [];
    this.searchKeys = '';
    this.page = {};
    this.columns = [{ 'label': 'Name', 'name': 'name', 'sortable': true },
    { 'label': 'Modified', 'name': 'modified', 'sortable': true, 'direction': 'desc' }];
  }

  ngOnInit() {
    this.searchInstruments('');
  }

  onToggleInstrumentForm() {
    this.showInstrumentForm = !this.showInstrumentForm;
    if (this.showInstrumentForm) {
      this.instrument = new Instrument();
      this.instrument.controlConstructs = [];
    }
  }

  onDetail(i: any) {
    this.selectedInstrument = i;
    this.isDetail = true;
  }

  hideDetail() {
    this.isDetail = false;
  }

  onPage(page: string) {
    console.log(page);
  }

  onCreateInstrument() {
    this.showInstrumentForm = false;
    this.service.create(this.instrument)
      .subscribe((result: any) => {
        this.instruments = [result].concat(this.instruments);
      }, (error: any) => {
        this.popupModal(error);
      });
    this.isDetail = false;
  }

  searchInstruments(key: string) {
    //console.log(key);
  }

  private popupModal(error: any) {
    this.error = error;
    this.modalActions.emit({action: 'modal', params: ['open']});
    // this.actions.emit({action:'modal', params:['open']});
  }

  private getSort() {
    const i = this.columns.findIndex((e: any) => e.sortable && e.direction !== undefined && e.direction !== '');
    let sort = '';
    if (i >= 0) {
      if (typeof this.columns[i].name === 'string') {
        sort = this.columns[i].name + ',' + this.columns[i].direction;
      } else {
        sort = this.columns[i].name.join('.') + ',' + this.columns[i].direction;
      }
    }
    return sort;
  }
}
