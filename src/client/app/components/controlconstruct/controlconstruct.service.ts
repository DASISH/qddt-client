import { Injectable, Inject } from '@angular/core';
import { Http } from '@angular/http';

import { API_BASE_HREF } from '../../api';
import { BaseService } from '../../common/base.service';

export class ControlConstruct {
  id: string;
  name: string;
  description: string;
  questionItem: any;
  otherMaterials: any;
  preInstructions: any[];
  postInstructions: any[];
}

export class Instruction {
  id: string;
  description: string;
}

@Injectable()
export class ControlConstructService extends BaseService {

  constructor(protected http:Http, @Inject(API_BASE_HREF) protected api:string) {
    super(http ,api);
  }

  save(c: ControlConstruct): any {
    return this.post(c,'controlconstruct/create/');
  }

  edit(c: ControlConstruct): any {
    return this.post(c, 'controlconstruct/');
  }

  getControlConstructsByQuestionItem(id: string): any {
    return this.get('controlconstruct//list/by-question/' + id);
  }

  getQuestionItems(key: string): any {
    return this.get('questionitem/page');
  }

  getQuestionItemsRevisions(id: string) : any {
    return this.get('audit/questionitem/' + id + '/all');
  }

  searchQuestionItems(name: string = '', page: String = '0'): any {
    let query = name.length > 0? '&question=' + '*' + name +'*': '';
    return this.get('questionitem/page/search?' + 'page=' + page + query);
  }

  searchInstructions(description: string = '', page: String = '0'): any {
    let query = description.length > 0? '&description=' + '*' + description +'*': '';
    return this.get('instruction/page/search?' + 'page=' + page + query);
  }
}
