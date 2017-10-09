import { Injectable, Inject } from '@angular/core';
import { Http } from '@angular/http';

import { API_BASE_HREF } from '../../api';
import { BaseService } from '../base.service';
import { Observable } from 'rxjs/Observable';


export function ElementEnumAware(constructor: Function) {
  constructor.prototype.ElementKind = ElementKind;
}

export enum ElementKind {
  CATEGORY =0,
  CONCEPT,
  CONDITION_CONSTRUCT,
  QUESTION_CONSTRUCT,
  SEQUENCE_CONSTRUCT,
  STATEMENT_CONSTRUCT,
  INSTRUMENT,
  PUBLICATION,
  QUESTIONITEM,
  RESPONSEDOMAIN,
  STUDY,
  SURVEY,
  TOPIC_GROUP,
  INSTRUCTION,
  UNIVERSE
}

export class QddtElementType {
  id:ElementKind;
  label:string;
  path:string;
  fields:any[];
  parameter:string;

  constructor(id:ElementKind,label:string, path:string,fields:any[],parameter:string) {
    this.id = id;
    this.label = label;
    this.path = path;
    this.fields = fields;
    this.parameter = parameter;
  }

  isMultipleFields(): boolean {
    return (this.fields.length > 1);
  }

  placeholder(): string {
    var message: string = 'Searches in [';
    this.fields.forEach(o => {
      message += o + ' and ';
    });
    return message.slice(0, message.length - 5) + ']';
  }
}

export const QddtElementTypes: QddtElementType[] = [
  new QddtElementType(ElementKind.CATEGORY, 'Category', 'category', ['label','description'],null),
  new QddtElementType(ElementKind.CONCEPT, 'Concept', 'concept',['name'],null),
  new QddtElementType(ElementKind.CONDITION_CONSTRUCT, 'Condition', 'controlconstruct',['name', 'condition'],
     '&constructkind=CONDITION_CONSTRUCT'),
  new QddtElementType(ElementKind.QUESTION_CONSTRUCT, 'QuestionConstruct', 'controlconstruct',['name', ['questionItem','name']],
     '&constructkind=QUESTION_CONSTRUCT'),
  new QddtElementType(ElementKind.SEQUENCE_CONSTRUCT, 'Sequence', 'controlconstruct',['name'],
     '&constructkind=SEQUENCE_CONSTRUCT'),
  new QddtElementType(ElementKind.STATEMENT_CONSTRUCT, 'Statement', 'controlconstruct',['name', 'preInstructions'],
     '&constructkind=STATEMENT_CONSTRUCT'),
  new QddtElementType(ElementKind.INSTRUMENT, 'Instrument', 'instrument',['label', 'description'],null),
  new QddtElementType(ElementKind.PUBLICATION, 'Publication', 'publication',['name', 'purpose'],null),
  new QddtElementType(ElementKind.QUESTIONITEM, 'QuestionItem', 'questionitem',['name', ['question','question']],null),
  new QddtElementType(ElementKind.RESPONSEDOMAIN, 'ResponseDomain', 'responsedomain',['name', 'description'],null),
  new QddtElementType(ElementKind.STUDY, 'Study', 'study',['name', 'description'],null),
  new QddtElementType(ElementKind.SURVEY, 'Survey', 'surveyprogram',['name', 'description'],null),
  new QddtElementType(ElementKind.TOPIC_GROUP, 'Module', 'topicgroup',['name', 'description'],null),
  new QddtElementType(ElementKind.INSTRUCTION, 'Instruction', 'instruction',['description'],null),
  new QddtElementType(ElementKind.UNIVERSE, 'Universe', 'universe',['description'],null),
];

@Injectable()
export class PreviewService extends BaseService {

  constructor(protected http: Http, @Inject(API_BASE_HREF) protected api: string) {
    super(http, api);
  }

  getRevisionById(elementTypeId:number, id: string, rev: string): any {
    let et: any = QddtElementTypes.find(e => e.id === elementTypeId);
    if (et !== undefined) {
      return this.get('audit/' + et.path + '/' + id + '/' + rev);
    }
     return Observable.of([]);
  }
  getRevisionByType(type:string, id: string, rev: string): any {
    let et: any = QddtElementTypes.find(e => e.label === type);
    if (et !== undefined) {
      return this.get('audit/' + et.path + '/' + id + '/' + rev);
    }
    return Observable.of([]);
  }


}
