import {Component} from 'angular2/core';

import {QuestionService, QuestionItem, Question} from './question.service';
import {QuestionDetail} from './question_detail.component';
import {QddtTableComponent} from '../table/table.component';
import {ResponseDomainSearchComponent} from '../responsedomain/responsedomain.search';
import {MaterializeDirective} from 'angular2-materialize/dist/materialize-directive';

@Component({
  selector: 'question',
  moduleId: module.id,
  templateUrl: './question.component.html',
  directives: [QuestionDetail
    , QddtTableComponent
    , MaterializeDirective
    , ResponseDomainSearchComponent],
  providers: [QuestionService]
})

export class QuestionComp {

  showQuestionItemForm: boolean = false;

  private questionitems: any;
  private page: any;
  private questionItem: any;
  private selectedQuestionItem: any;
  private isDetail: boolean;
  private columns: any[];

  constructor(private questionService: QuestionService) {
    this.isDetail = false;
    this.questionitems = [];
    this.page = {};
    this.columns = [{'name':['question','question'], 'label':'Question Text', 'sortable':true}
      ,{'name':['responseDomain','name'], 'label':'ResponseDomain Name', 'sortable':true}];
  }

  ngOnInit() {
    this.questionService.getQuestionItemPage().subscribe(
      result => { this.page = result.page; this.questionitems = result.content; });
  }

  onToggleQuestionItemForm() {
    this.showQuestionItemForm = !this.showQuestionItemForm;
    if (this.showQuestionItemForm) {
      this.questionItem = new QuestionItem();
      this.questionItem.question = new Question();
    }
  }

  onDetail(questionItem: any) {
    this.selectedQuestionItem = questionItem;
    this.isDetail = true;
  }

  hideDetail() {
    this.isDetail = false;
  }

  onPage(page: string) {
    this.questionService.getQuestionItemPage(page).subscribe(
      result => { this.page = result.page; this.questionitems = result.content; });
  }

  onCreateQuestionItem() {
    this.showQuestionItemForm = false;
    this.questionItem.question.name = this.questionItem.question.question;
    this.questionService.save(this.questionItem.question)
      .subscribe(result => {
        this.questionItem.question = result;
        this.questionService.createQuestionItem(this.questionItem)
          .subscribe(result => {
            this.questionitems.push(result);
          });
      });
    this.isDetail = false;
  }

  selectResponseDomain(responseDomain: any) {
    this.questionItem.responseDomain = responseDomain;
    document.getElementById('questionItem-modal-close').click();
  }
}
