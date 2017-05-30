import { Component, OnInit, AfterContentChecked, EventEmitter } from '@angular/core';

import { QuestionService, QuestionItem, Question } from './question.service';
import { UserService } from '../../common/user.service';
import { Subject }          from 'rxjs/Subject';
import { MaterializeAction } from 'angular2-materialize';

@Component({
  selector: 'qddt-questionitem',
  moduleId: module.id,
  templateUrl: './question.component.html',
  providers: [QuestionService]
})

export class QuestionComponent implements AfterContentChecked, OnInit {

  showQuestionItemForm: boolean = false;
  showResponsedomainReuse: boolean = false;
  modalActions = new EventEmitter<string|MaterializeAction>();
  error: string;
  responseDomainAction = new EventEmitter<string|MaterializeAction>();
  previewResponseDomain: any;
  showbutton: any;
  questionitems: any;
  private page: any;
  private questionItem: any;
  private selectedQuestionItem: any;
  private isDetail: boolean;
  private isLoading: boolean = true;
  private columns: any[];
  private searchKeysSubect: Subject<string> = new Subject<string>();
  private searchKeys: string;
  private secondCS: any;
  private mainresponseDomainRevision: number;

  constructor(private questionService: QuestionService, private userService: UserService) {
    this.questionitems = [];
    this.page = {};
    this.searchKeys = '';
    this.secondCS = null;
    this.mainresponseDomainRevision = 0;
    this.showbutton = false;
    this.columns = [{'name':'name', 'label':'Question Name', 'sortable':true, 'direction': '' },
      {'name':['question','question'], 'label':'Question Text', 'sortable':true, 'direction': '' },
      {'name':['responseDomain','name'], 'label':'ResponseDomain Name', 'sortable':true, 'direction': '' },
      { 'label': 'Modified', 'name': 'modified', 'sortable': true, 'direction': 'desc' }];
    this.searchKeysSubect
      .debounceTime(300)
      .distinctUntilChanged()
      .subscribe((name: string) => {
        this.questionService.searchQuestionItemsByNameAndQuestion(name, '0', this.getSort()).subscribe((result: any) => {
          this.page = result.page;
          this.questionitems = result.content;
          this.isLoading = false;
        });
      });
  }

  ngOnInit() {
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

  onEditMissing(missing: any) {
    this.secondCS = missing;
    this.buildPreviewResponseDomain();
    return false;
  }

  onToggleQuestionItemForm() {
    this.showQuestionItemForm = !this.showQuestionItemForm;
    if (this.showQuestionItemForm) {
      this.questionItem = new QuestionItem();
      this.questionItem.question = new Question();
      this.secondCS = null;
      this.questionItem.responseDomain = null;
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
    this.isLoading = true;
    this.questionService.searchQuestionItems(this.searchKeys, page, this.getSort()).subscribe(
      (result: any) => { this.page = result.page; this.questionitems = result.content; this.isLoading = false;});
  }

  onCreateQuestionItem() {
    this.isLoading = true;
    this.showQuestionItemForm = false;
    this.questionItem.question.name = this.questionItem.name;
    if (this.secondCS === null) {
      this.questionItem.responseDomainRevision = this.mainresponseDomainRevision;
      this.questionService.createQuestionItem(this.questionItem)
        .subscribe((result: any) => {
          this.questionitems = [result].concat(this.questionitems);
        }, (err: any) => { this.error = err.toString(); this.modalActions.emit({action:'modal', params:['open']}); });
    } else {
      this.questionItem.responseDomainRevision = 0;
      this.createMixedCategory().subscribe((result: any) => {
        this.createMixedResponseDomain(result).subscribe((result: any) => {
          this.questionItem.responseDomain = result;
          this.questionService.updateQuestionItem(this.questionItem)
            .subscribe((result: any) => {
              this.questionitems = [result].concat(this.questionitems);
              this.isLoading = false;
            }, (err: any) => { this.error = err.toString(); this.modalActions.emit({action:'modal', params:['open']}); });
        }, (err: any) => { this.error = err.toString(); this.modalActions.emit({action:'modal', params:['open']}); });
      }, (err: any) => { this.error = err.toString(); this.modalActions.emit({action:'modal', params:['open']}); });
    }
    this.isDetail = false;
  }

  responseDomainReuse(item: any) {
    this.questionItem.responseDomain = item.responseDomain;
    this.mainresponseDomainRevision = item.responseDomainRevision || 0;
    this.showResponsedomainReuse = false;
    this.buildPreviewResponseDomain();
    this.responseDomainAction.emit({action:'modal', params:['close']});
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

  private createMixedCategory() {
    let rep = {};
    rep['categoryType'] = 'MIXED';
    rep['hierarchyLevel'] = 'GROUP_ENTITY';
    rep['name'] = rep['description'] = 'mixed category';
    rep['children'] = [];
    if (this.questionItem.responseDomain !== null
      && this.questionItem.responseDomain !== undefined) {
      rep['children'].push(this.questionItem.responseDomain['managedRepresentation']);
    }
    if (this.secondCS !== null && this.secondCS !== undefined) {
      rep['children'].push(this.secondCS);
    }
    return this.questionService.createCategory(rep);
  }

  private createMixedResponseDomain(result: any) {
    let rd: any = {};
    rd['responseKind'] = 'MIXED';
    rd['description'] = '';
    let mainResponseDomain = this.questionItem.responseDomain;
    rd['name'] = (mainResponseDomain.name || ' ') + ' + ' + this.secondCS.name;
    rd['managedRepresentation'] = result;
    rd['displayLayout'] = mainResponseDomain['displayLayout'];
    let representation = rd['managedRepresentation'];
    for (let i = 0; i < representation.children.length; i++) {
      let category = representation.children[i];
      if (representation.children[i].categoryType === 'MISSING_GROUP') {
        for (let i = 0; i < category.children.length; i++) {
          category.children[i].code = this.secondCS.children[i].code;
        }
      } else {
        for (let i = 0; i < category.children.length; i++) {
          category.children[i].code = mainResponseDomain['managedRepresentation'].children[i].code;
        }
      }
    }
    return this.questionService.createResponseDomain(rd);
  }

  private buildPreviewResponseDomain() {
    if (this.secondCS !== null) {
      this.previewResponseDomain = {};
      this.previewResponseDomain['responseKind'] = 'MIXED';
      let rep = {};
      rep['categoryType'] = 'MIXED';
      rep['hierarchyLevel'] = 'GROUP_ENTITY';
      rep['name'] = rep['description'] = 'mixed category';
      rep['children'] = [];
      if (this.questionItem.responseDomain !== null
        && this.questionItem.responseDomain !== undefined) {
        rep['children'].push(this.questionItem.responseDomain['managedRepresentation']);
      }
      if (this.secondCS !== null && this.secondCS !== undefined) {
        rep['children'].push(this.secondCS);
      }
      this.previewResponseDomain['managedRepresentation'] = rep;
      if (this.questionItem.responseDomain !== null && this.questionItem.responseDomain !== undefined) {
        this.previewResponseDomain['responseCardinality'] = this.questionItem.responseDomain.responseCardinality;
        this.previewResponseDomain['displayLayout'] = this.questionItem.responseDomain.displayLayout;
      }
    } else {
      this.previewResponseDomain = this.questionItem.responseDomain;
    }
  }
}
