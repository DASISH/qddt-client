import { Component, EventEmitter, OnInit, AfterContentChecked } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { ControlConstructService, QuestionConstruct, Instruction, Universe } from '../controlconstruct.service';
import { Subject } from 'rxjs/Subject';
import { MaterializeAction } from 'angular2-materialize';
import { Column } from '../../shared/table/table.column';

@Component({
  selector: 'qddt-control-construct-list',
  moduleId: module.id,
  templateUrl: './questionconstruct-list.component.html',
  styles: [],
})
export class QuestionConstructListComponent implements OnInit {
  public controlConstructs: QuestionConstruct[];
  public showProgressBar = false;

  private showControlConstructForm = false;
  private searchKeys: string;
  private page = {};
  private searchKeysSubect: Subject<string> = new Subject<string>();
  private readonly columns = [
     new Column({ name: 'name', label: 'Construct Name', sortable: true }),
     new Column({ name: 'questionName', label: 'Question Name', sortable: true }),
     new Column({ name: 'questionText', label: 'Question Text', sortable: true }),
     new Column({ name: 'modified',  label: 'Modified', sortable: true, direction: 'desc' })
  ];

  constructor(private service: ControlConstructService, private router: Router, private route: ActivatedRoute ) {
    this.searchKeysSubect
      .debounceTime(300)
      .distinctUntilChanged()
      .subscribe((name: string) => {
        this.showProgressBar = true;
        const args = name.split(' ');
        service.searchControlConstructs(args[0], args[1] ? args[1] : '*', '0', this.getSort()).then(
          (result) => {
            this.page = result.page;
            this.controlConstructs = result.content;
            this.showProgressBar = false; },
          (error) => {
              this.showProgressBar = false;
              throw error;
          });
      });
  }

  ngOnInit(): void {
    this.onSearchKey('');
  }

  onPage(page: string) {
    this.showProgressBar = true;
    const args = this.searchKeys.split(', ');
    this.service.searchControlConstructs(args[0], args[1] ? args[1] : '*', page, this.getSort()).then(
      (result: any) => {
        this.page = result.page;
        this.controlConstructs = result.content;
        this.showProgressBar = false; },
      (error: any) => {
        this.showProgressBar = false;
        throw error;
      });
  }

  onSearchKey(search: string ) {
      this.searchKeys = search;
      this.searchKeysSubect.next(search);
  }

  onDetail(item: QuestionConstruct ) {
      this.router.navigate(['./', item.id ], { relativeTo: this.route });
  }

  private getSort() {
    const i = this.columns.findIndex((e: any) => e.sortable && e.direction && e.direction !== '');
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


