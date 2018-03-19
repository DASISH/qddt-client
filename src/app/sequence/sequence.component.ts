import { Component, OnInit, EventEmitter } from '@angular/core';
import { SequenceService, Sequence } from './sequence.service';
import { Subject } from 'rxjs/Subject';
import { MaterializeAction } from 'angular2-materialize';
import { ElementKind, ElementEnumAware } from '../preview/preview.service';

@Component({
  selector: 'qddt-sequence',
  moduleId: module.id,
  templateUrl: './sequence.component.html',
  styles: [],

})
@ElementEnumAware
export class SequenceComponent implements OnInit {

  public modalActions = new EventEmitter<string|MaterializeAction>();
  public isDetail: boolean;
  public showSequenceForm = false;
  public showAddElement = false;
  public sequences: any[];

  private page: any;
  private sequence: any;
  private searchKeys: string;
  private selectedSequence: any;
  private columns: any[];
  private elementType: number;
  private elements: any[];
  private searchKeysSubect: Subject<string> = new Subject<string>();
  private readonly SEQUENCECONSTRUCT = ElementKind.SEQUENCE_CONSTRUCT;

  constructor(private service: SequenceService) {
    this.isDetail = false;
    this.sequences = [];
    this.searchKeys = '';
    this.page = {};
    this.elementType = 0;
    this.elements = [];
    this.columns = [{ 'label': 'Name', 'name': 'name', 'sortable': true },
    { 'label': 'Description', 'name': 'description', 'sortable': true },
    { 'label': 'Modified', 'name': 'modified', 'sortable': true, 'direction': 'desc' }];
    this.searchKeysSubect
      .debounceTime(300)
      .distinctUntilChanged()
      .subscribe((name: string) => {
        this.service.getElements( this.SEQUENCECONSTRUCT, name, '0', this.getSort())
          .then((result: any) => {
            this.sequences = result.content;
            this.page = result.page;
          });
      });
  }

  ngOnInit() {
    this.onSearchSequences('*');
  }

  onToggleSequenceForm() {
    this.showSequenceForm = !this.showSequenceForm;
    if (this.showSequenceForm) {
      this.sequence = new Sequence();
      this.sequence.children = [];
    }
  }

  onGetElement(element: any) {
    this.sequence.children.push(element);
  }

  onDetail(i: any) {
    this.selectedSequence = i;
    this.isDetail = true;
  }

  onHideDetail() {
    this.isDetail = false;
  }

  onPage(page: string) {
    this.service.getElements(ElementKind.SEQUENCE_CONSTRUCT, this.searchKeys, page, this.getSort())
      .then((result: any) => {
        this.sequences = result.content;
        this.page = result.page;
      });
  }

  onSearchSequences(key: string) {
    this.searchKeys = key;
    this.searchKeysSubect.next(key);
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
