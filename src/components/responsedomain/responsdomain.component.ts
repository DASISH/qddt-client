import {Component} from 'angular2/core';
import {QuestionDetail} from '../question/question_detail.component';


@Component({
  selector: 'responsedomain',
  moduleId: module.id,
  templateUrl: './responsedomain.component.html',
  directives: [QuestionDetail]
})
export class ResponsedomainComp {

}
