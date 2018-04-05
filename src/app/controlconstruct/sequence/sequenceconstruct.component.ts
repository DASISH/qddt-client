import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { ElementEnumAware } from '../../preview/preview.service';
import { ControlConstructService, SequenceConstruct } from '../controlconstruct.service';
import { ElementKind } from '../../shared/elementinterfaces/elements';
import { Column } from '../../shared/table/table.column';

@Component({
  selector: 'qddt-sequence',
  moduleId: module.id,
  templateUrl: './sequenceconstruct.component.html',
})
@ElementEnumAware
export class SequenceConstructComponent implements OnInit {

  public isDetail = false;
  public showSequenceForm = false;
  public showAddElement = false;
  public sequences: SequenceConstruct[];
  public sequence: SequenceConstruct;

  private page = {};
  private searchKeys = '';
  private selectedSequence: SequenceConstruct;
  private searchKeysSubject: Subject<string> = new Subject<string>();
  private readonly SEQUENCECONSTRUCT = ElementKind.SEQUENCE_CONSTRUCT;
  private readonly columns = [
    new Column({ label: 'Name', name: 'name', sortable: true }),
    new Column({ label: 'Description', name: 'description', sortable: true }),
    new Column({ label: 'Modified', name: 'modified', sortable: true, direction: 'desc' })
  ];

  constructor(private service: ControlConstructService) {
    this.searchKeysSubject
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
      this.sequence = new SequenceConstruct();
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
    this.searchKeysSubject.next(key);
  }

  onCreateSequence() {
      this.service.createSequence(this.sequence)
      .subscribe(
        (result) => this.sequences.push(result),
        (error) => { throw error; });
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
