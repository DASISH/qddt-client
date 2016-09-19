import {Component} from 'angular2/core';

import {ControlConstructService, ControlConstruct} from './controlconstruct.service';
import {QddtTableComponent} from '../table/table.component';
import {ControlConstructDetailComponent} from './controlconstruct.detail.component';

@Component({
  selector: 'qddt-controle-construct',
  moduleId: module.id,
  templateUrl: './controlconstruct.component.html',
  providers: [ControlConstructService],
  directives: [QddtTableComponent, ControlConstructDetailComponent]
})
export class ControlConstructComponent {

  showControlConstructForm: boolean = false;

  private controlConstructs: any;
  private page: any;
  private controlConstruct: any;
  private searchKeys: string;
  private selectedControlConstruct: any;
  private isDetail: boolean;
  private columns: any[];

  constructor(private service: ControlConstructService) {
    this.isDetail = false;
    this.controlConstructs = [];
    this.searchKeys = '';
    this.page = {};
    this.columns = [{ 'label': 'Name', 'name': 'name', 'sortable': true }];
  }

  ngOnInit() {
    this.controlConstructs = [];
  }

  onToggleControlConstructForm() {
    this.showControlConstructForm = !this.showControlConstructForm;
    if (this.showControlConstructForm) {
      this.controlConstruct = new ControlConstruct();
    }
  }

  onDetail(category: any) {
    this.selectedControlConstruct = category;
    this.isDetail = true;
  }

  hideDetail() {
    this.isDetail = false;
  }

  onPage(page: string) {
    console.log(page);
  }

  onCreateControlConstruct() {
    this.showControlConstructForm = false;
    this.service.save(this.controlConstruct)
      .subscribe(result => {
        //this.controlConstructs.push(result);
        this.controlConstructs = [result];
      });
    this.isDetail = false;
  }

  searchControlConstructs(name: string) {
    console.log(name);
  }
}
