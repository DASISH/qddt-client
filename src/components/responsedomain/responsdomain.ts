import {Component,Input} from 'angular2/core';
import {ResponseDomain,ResponseDomainService} from './responsdomainservice';
import {QuestionDetail} from '../question/question_detail';


@Component({
  selector: 'responsedomain',
  templateUrl: './components/responsedomain/responsedomain.html',
  styleUrls: ['./components/responsedomain/responsedomain.css'],
  directives: [QuestionDetail]
})

export class ResponsedomainComp {
  @Input() selectedentity: ResponseDomain;

  constructor(private service: ResponseDomainService) {
    this.service = service;
  }

  save() {
    console.log('ResponseDomain save');
    this.selectedentity = this.service.save(this.selectedentity);
  }
}
