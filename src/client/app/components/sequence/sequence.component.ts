import { Component, OnInit, EventEmitter } from '@angular/core';
import { ElementTypeDescription, SequenceService, Sequence } from './sequence.service';

@Component({
  selector: 'qddt-sequence',
  moduleId: module.id,
  templateUrl: './sequence.component.html',
  styles: [
    `.noItemFound {
        border: thick solid red;
    }`
  ],
  providers: [ SequenceService ],
})
export class SequenceComponent implements OnInit {

  showSequenceForm: boolean = false;
  showAddElement: boolean = false;
  actions = new EventEmitter<any>();
  error: any;
  elementTypeDescription:any = ElementTypeDescription;

  private sequences: any[];
  private page: any;
  private sequence: any;
  private searchKeys: string;
  private selectedSequence: any;
  private isDetail: boolean;
  private columns: any[];
  private elementType: number;
  private elements: any[];

  constructor(private service: SequenceService) {
    this.isDetail = false;
    this.sequences = [];
    this.searchKeys = '';
    this.page = {};
    this.elementType = 0;
    this.elements = [];
    this.columns = [{ 'label': 'Name', 'name': 'name', 'sortable': true },
    { 'label': 'Description', 'name': 'description', 'sortable': true }];
  }

  ngOnInit() {
    this.searchSequences('');
  }

  onToggleSequenceForm() {
    this.showSequenceForm = !this.showSequenceForm;
    if (this.showSequenceForm) {
      this.sequence = new Sequence();
    }
  }

  onDetail(i: any) {
    this.selectedSequence = i;
    this.isDetail = true;
  }

  hideDetail() {
    this.isDetail = false;
  }

  onPage(page: string) {
    this.searchSequences(this.searchKeys, page);
  }

  onCreateSequence() {
    this.showSequenceForm = false;
    this.service.create(this.sequence)
      .subscribe((result: any) => {
        this.sequences = [result].concat(this.sequences);
      }, (error: any) => {
        this.popupModal(error);
      });
    this.isDetail = false;
  }

  searchSequences(key: string, page: string = '') {
    this.searchKeys = key;
    this.service.getElements('SEQUENCE_CONSTRUCT', key, page)
      .subscribe((result: any) => {
        this.sequences = result.content;
        this.page = result.page;
      }, (error: any) => {
        this.popupModal(error);
      });
  }

  private popupModal(error: any) {
    this.error = error;
    this.actions.emit('openModal');
  }
}
