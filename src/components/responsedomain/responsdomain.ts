import {Component} from 'angular2/core';
import {QuestionDetail} from '../question/question_detail';


@Component({
  selector: 'responsedomain',
  templateUrl: './components/responsedomain/responsedomain.html',
  styleUrls: ['./components/responsedomain/responsedomain.css'],
  directives: [QuestionDetail]
})
export class ResponsedomainComp {

}
