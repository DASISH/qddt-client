import { Component, OnInit, AfterContentChecked, EventEmitter } from '@angular/core';
import { QuestionService, QuestionItem } from './question.service';
import { Subject }          from 'rxjs/Subject';
import { MaterializeAction } from 'angular2-materialize';
import { Column } from '../shared/table/table.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'qddt-questionitem',
  moduleId: module.id,
  templateUrl: './question.component.html',
  styles:[':host /deep/ .hoverable .row { min-height:3rem; margin-bottom:0px;}'],
  providers: [QuestionService]
})

export class QuestionComponent implements AfterContentChecked, OnInit {

  public modalActions = new EventEmitter<MaterializeAction>();
  public responseDomainAction = new EventEmitter<MaterializeAction>();
  public error: string;
  // public previewResponseDomain: any;
  public showbutton: any;
  public questionitems: any;

  private page: any;
  private questionItem: any;
  private selectedQuestionItem: any;
  private isDetail: boolean;
  private showProgressBar: boolean = false;
  private showResponsedomainReuse: boolean = false;
  private showQuestionItemForm: boolean = false;
  private columns: Column[];
  private searchKeysSubect: Subject<string> = new Subject<string>();
  private searchKeys: string;
  private secondCS: any;
  private mainresponseDomainRevision: number;

  constructor(private questionService: QuestionService, private userService: AuthService,private route: ActivatedRoute) {
    this.questionitems = [];
    this.page = {number:1, size:10};
    this.searchKeys = '';
    this.secondCS = null;
    this.mainresponseDomainRevision = 0;
    this.showbutton = false;
    this.columns = [{'name':'name', 'label':'Question Name', 'sortable':true, 'direction': '' ,'width':'15%'},
      {'name':'question', 'label':'Question Text', 'sortable':true, 'direction': '' ,'width':'50%'},
      {'name':['responseDomain','name'], 'label':'ResponseDomain Name', 'sortable':true, 'direction': '','width':'20%' },
      { 'label': 'Modified', 'name': 'modified', 'sortable': true, 'direction': 'desc' ,'width':'8%'}];
    this.searchKeysSubect
      .debounceTime(300)
      .distinctUntilChanged()
      .subscribe((name: string) => {
        this.showProgressBar = true;
        this.questionService.searchQuestionItems(name, '0', this.getSort())
          .subscribe((result: any) => {
            this.page = result.page;
            this.questionitems = result.content;
            this.showProgressBar = false;
        });
      });
  }

  ngOnInit() {
    this.route.paramMap
      .switchMap((params: ParamMap) =>
        params.has('id')? this.questionItem = this.questionService.getquestion(params.get('id')):null);

    let config = this.userService.getGlobalObject('questions');
    if (config.current === 'detail' ) {
      this.page = config.page;
      this.questionitems = config.collection;
      this.selectedQuestionItem = config.item;
      this.isDetail = true;
    } else {
      this.searchKeys = config.key;
      this.searchKeysSubect.next(this.searchKeys);
    }
  }

  ngAfterContentChecked() {
    let config = this.userService.getGlobalObject('questions');
    if (config.current === 'detail' ) {
      this.page = config.page;
      this.questionitems = config.collection;
      this.selectedQuestionItem = config.item;
      this.searchKeys = config.key;
      this.isDetail = true;
    } else {
      this.isDetail = false;
      if(config.key === null || config.key === undefined) {
        this.userService.setGlobalObject('questions', {'current': 'list', 'key': ''});
        this.searchKeys = '';
        this.searchKeysSubect.next('');
      }
    }
  }

  onToggleQuestionItemForm() {
    this.showQuestionItemForm = !this.showQuestionItemForm;
    if (this.showQuestionItemForm) {
      this.questionItem = new QuestionItem();
      this.questionItem.responseDomain =null;
    }
  }

  onDetail(questionItem: any) {
    this.selectedQuestionItem = questionItem;
    this.isDetail = true;
    this.userService.setGlobalObject('questions',
      {'current': 'detail',
        'page': this.page,
        'key': this.searchKeys,
        'item': this.selectedQuestionItem,
        'collection': this.questionitems});
  }

  hideDetail() {
    this.isDetail = false;
    this.userService.setGlobalObject('questions', {'current': 'list', 'key': this.searchKeys});
  }

  onPage(page: string) {
    this.showProgressBar = true;
    this.questionService.searchQuestionItems(this.searchKeys, page, this.getSort())
      .subscribe(
      (result: any) => {
        this.page = result.page;
        this.questionitems = result.content;
        this.showProgressBar = false;
      });
  }

  onCreateQuestionItem() {
    this.showProgressBar = true;
    this.showQuestionItemForm = false;
    if((this.questionItem.responseDomain) && (!this.questionItem.responseDomain.id))
      this.questionService.createCategory(this.questionItem.responseDomain.managedRepresentation)
        .subscribe(result => {
          this.questionItem.responseDomain.managedRepresentation = result;
          this.questionService.createResponseDomain(this.questionItem.responseDomain)
            .subscribe(result => {
              this.questionItem.responseDomain = result;
              this.questionItem.responseDomainRevision =0;
              this.questionService.updateQuestionItem(this.questionItem)
                .subscribe((result: any) => {
                  this.questionItem = null;
                  this.questionitems = [result].concat(this.questionitems);
                  this.showProgressBar = false;
                  // this.editQuestionItem.emit(this.questionItem);
                }, (err: any) => { this.error = err.toString();
                  this.modalActions.emit({action:'modal', params:['open', err.toString()]}); });
            }, (err: any) => { this.error = err.toString();
              this.modalActions.emit({action:'modal', params:['open', err.toString()]}); });
        }, (err: any) => { this.error = err.toString();
          this.modalActions.emit({action:'modal', params:['open', err.toString()]}); });
    else {
      this.questionService.updateQuestionItem(this.questionItem)
        .subscribe((result: any) => {
          this.questionitems = [result].concat(this.questionitems);
          this.showProgressBar = false;
        }, (err: any) => { this.error = err.toString();
          this.modalActions.emit({action:'modal', params:['open', err.toString()]}); });
    }
    this.isDetail = false;
  }

  onResponseDomainSelected(item: any) {
    this.questionItem.responseDomain = item.responseDomain;
    this.questionItem.responseDomainRevision = item.responseDomainRevision || 0;
  }

  onResponsedomainRemove(item: any) {
    this.questionItem.responseDomainRevision = 0;
    this.questionItem.responseDomain = null;
  }

  onDismiss() {
    this.responseDomainAction.emit({action:'modal', params:['close']});
  }

  openResponseDomainModal() {
    this.showResponsedomainReuse = true;
    this.responseDomainAction.emit({action:'modal', params:['open']});
  }

  searchResponseDomains(name: string) {
    this.searchKeys = name;
    this.searchKeysSubect.next(name);
  }

  private getSort() {
    let i = this.columns.findIndex((e: any) => e.sortable && e.direction !== '');
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
