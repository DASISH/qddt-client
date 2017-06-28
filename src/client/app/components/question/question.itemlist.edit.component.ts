import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MaterializeAction } from 'angular2-materialize';
import { QuestionService } from './question.service';

@Component({
  selector: 'qddt-questionitems-edit',
  providers: [ QuestionService ],
  moduleId: module.id,
  templateUrl: './question.itemlist.edit.component.html',
  styles: [
    ':host /deep/ .collection-item .row { min-height:3rem; margin-bottom:0px;border-bottom: none;}',
    '.collection .collection-item {border-bottom: none; }',
    '.collection.with-header .collection-header {border-bottom: none; padding: 0px;}',
    '.collection {border:none; }'],

})

export class QuestionItemsEditComponent {
  @Output() questionItemAddEvent: EventEmitter<any> = new EventEmitter();
  @Output() questionItemRemoveEvent: EventEmitter<any> = new EventEmitter();
  @Input() questionItems: any[];
  @Input() owner: any;

  private questionItemActions = new EventEmitter<string | MaterializeAction>();
  private showQuestionForm: boolean = false;
  private questionItem: any;
  private showbutton: boolean = false;

  constructor(private questionService: QuestionService) {

  }

  onClickQuestionItem(questionItem) {
    this.questionItem = questionItem;
    this.questionItemActions.emit({action: 'modal', params: ['open']});
  }

  onQuestionItemSave() {
    this.showQuestionForm = false;
    // this.concept.conceptQuestionItems.push({'id': {questionItemId: this.questionItem.id, conceptId: this.concept.id}});
    // this.conceptService.updateConcept(this.concept)
    //   .subscribe((result: any) => {
    //     this.concept = result;
    //   }, (error: any) => console.log(error));
  }

  removeQuestionItem(questionItem: any) {
    // this.conceptService.deattachQuestion(this.concept.id, questionItem)
    //   .subscribe((result: any) => {
    //       this.concept = result;
    //     }
    //     , (err: any) => console.log('ERROR: ', err));
  }

  setQuestionItem(questionItem: any) {
    // this.conceptService.attachQuestion(this.concept.id, questionItem.id, questionItem['questionItemRevision'])
    //   .subscribe((result: any) => {
    //     this.concept = result;
    //   }, (error: any) => console.log(error));
  }

}
