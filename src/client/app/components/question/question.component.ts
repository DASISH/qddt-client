import { Component, OnInit } from '@angular/core';

import { QuestionService, QuestionItem, Question } from './question.service';

@Component({
  selector: 'question',
  moduleId: module.id,
  templateUrl: './question.component.html',
  providers: [QuestionService]
})

export class QuestionComp implements OnInit {

  showQuestionItemForm: boolean = false;

  private questionitems: any;
  private page: any;
  private questionItem: any;
  private selectedQuestionItem: any;
  private isDetail: boolean;
  private columns: any[];
  private searchKeys: string;

  constructor(private questionService: QuestionService) {
    this.isDetail = false;
    this.questionitems = [];
    this.page = {};
    this.searchKeys = '';
    this.columns = [{'name':['question','question'], 'label':'Question Text', 'sortable':true}
      ,{'name':['responseDomain','name'], 'label':'ResponseDomain Name', 'sortable':true}];
  }

  ngOnInit() {
    this.questionService.getQuestionItemPage().subscribe(
      (result: any) => { this.page = result.page; this.questionitems = result.content; });
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
    this.questionService.searchQuestionItems(this.searchKeys, page).subscribe(
      (result: any) => { this.page = result.page; this.questionitems = result.content; });
  }

  onCreateQuestionItem() {
    this.showQuestionItemForm = false;
    this.questionItem.question.name = this.questionItem.name;
    this.questionService.createQuestionItem(this.questionItem)
      .subscribe((result: any) => {
        this.questionitems.push(result);
      });
    this.isDetail = false;
  }

  selectResponseDomain(responseDomain: any) {
    this.questionItem.responseDomain = responseDomain;
    document.getElementById('questionItem-modal-close').click();
  }

  searchResponseDomains(name: string) {
    this.searchKeys = name;
    this.questionService.searchQuestionItems(name).subscribe((result: any) => {
      this.page = result.page;
      this.questionitems = result.content;
    });
  }
}
