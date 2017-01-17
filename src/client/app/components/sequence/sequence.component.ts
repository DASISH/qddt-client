import { Component, OnInit, EventEmitter } from '@angular/core';
import { ElementTypeDescription, SequenceService, Sequence } from './sequence.service';
import { Subject } from 'rxjs/Subject';

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
  private searchKeysSubect: Subject<string> = new Subject<string>();

  constructor(private service: SequenceService) {
    this.isDetail = false;
    this.sequences = [];
    this.searchKeys = '';
    this.page = {};
    this.elementType = 0;
    this.elements = [];
    this.columns = [{ 'label': 'Name', 'name': 'name', 'sortable': true },
    { 'label': 'Description', 'name': 'description', 'sortable': true }];
    this.searchKeysSubect
      .debounceTime(300)
      .distinctUntilChanged()
      .subscribe((name: string) => {
        this.service.getElements('SEQUENCE_CONSTRUCT', name)
          .subscribe((result: any) => {
            this.sequences = result.content;
            this.page = result.page;
          }, (error: any) => {
            this.popupModal(error);
          });
      });
  }

  ngOnInit() {
    this.searchSequences('');
  }

  onToggleSequenceForm() {
    this.showSequenceForm = !this.showSequenceForm;
    if (this.showSequenceForm) {
      this.sequence = new Sequence();
      this.sequence.children = [];
      this.sequence.controlConstructKind = 'SEQUENCE_CONSTRUCT';
    }
  }

  onGetElement(element: any) {
    this.sequence.children.push(element);
  }

  onDetail(i: any) {
    this.selectedSequence = i;
    this.isDetail = true;
  }

  hideDetail() {
    this.isDetail = false;
  }

  onPage(page: string) {
    this.service.getElements('SEQUENCE_CONSTRUCT', this.searchKeys, page)
      .subscribe((result: any) => {
        this.sequences = result.content;
        this.page = result.page;
      }, (error: any) => {
        this.popupModal(error);
      });
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

  searchSequences(key: string) {
    this.searchKeys = key;
    this.searchKeysSubect.next(key);
  }

  private popupModal(error: any) {
    this.error = error;
    this.actions.emit('openModal');
  }
}
