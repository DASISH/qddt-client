import { Component, OnInit, EventEmitter } from '@angular/core';
import { InstrumentService, Instrument } from './instrument.service';
import { MaterializeAction } from 'angular2-materialize';

@Component({
  selector: 'qddt-instrument',
  moduleId: module.id,
  templateUrl: './instrument.component.html',
  styles: [],
  providers: [InstrumentService],
})
export class InstrumentComponent implements OnInit {

  public showInstrumentForm = false;
  public isDetail: boolean;
  public instruments: any[];

  private page: any;
  private instrument: any;
  private searchKeys: string;
  private selectedInstrument: any;
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
      .subscribe(
        result => { this.instruments = [result].concat(this.instruments); },
        error => { throw error; }
      );
    this.isDetail = false;
  }

  searchInstruments(key: string) {
    //console.log(key);
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
