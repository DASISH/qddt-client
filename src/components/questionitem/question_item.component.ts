import {Component} from 'angular2/core';

import {QuestionItemService} from './question_item.service';
import {QuestionItemList} from './question_item_list.component';
import {QuestionItemDetail} from './question_item_detail.component';

@Component({
  selector: 'question',
  moduleId: module.id,
  templateUrl: './question_item.component.html',
  directives: [QuestionItemList, QuestionItemDetail],
  providers: [QuestionItemService]
})

export class QuestionItemComp {

  //private questions: any;

  constructor(private questionService: QuestionItemService) {
  }

  //
  //ngOnChanges() {
  //  console.log('ngOnChanges - fetch questions');
  //  this.questionService.getAll().subscribe(result => this.questions = result);
  //}
}
