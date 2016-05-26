import {Component, Input,Output,EventEmitter} from 'angular2/core';
import {MaterializeDirective} from 'angular2-materialize/dist/materialize-directive';

import {LocalDatePipe} from '../../common/date_pipe';
import {Change} from '../../common/change_status';
import {QuestionItemService} from './question_item.service';

@Component({
  selector: 'question-detail',
  moduleId: module.id,
  templateUrl: './question_detail.component.html',
  providers: [QuestionItemService],
  pipes: [LocalDatePipe],
  directives: [MaterializeDirective],
})

export class QuestionItemDetail {

  @Output() questionModifiedEvent:EventEmitter<String> = new EventEmitter();
  @Input() question:any;

  changes: any = Change.status;

  constructor(private service:QuestionItemService) {

  }


  onSaveQuestion() {
    this.service.save(this.question)
      .subscribe(result => {
        this.questionModifiedEvent.emit(result);
      });
  }

}
