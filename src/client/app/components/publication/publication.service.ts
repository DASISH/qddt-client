import { Injectable, Inject } from '@angular/core';
import { Http, RequestOptions, Headers, ResponseContentType } from '@angular/http';
import { API_BASE_HREF } from '../../api';
import { BaseService } from '../../common/base.service';
import { Observable }     from 'rxjs/Observable';
import { ElementKind, QddtElementType, QddtElementTypes } from '../../common/preview/preview.service';

export const PUBLICATION_NOT_PUBLISHED = { 'id': 0, 'name': 'NOTPUBLISHED', 'label':'Not Published', 'children': [],
  'description': 'Elements and discussion made available for key '
    + 'members of a questionnaire design sub'
    + ' group, but not designed to be published internally'};

export const PUBLICATION_STATUS: any = [
  {
    'id': 1, 'name': 'INTERNALPUBLICATION', 'label': 'Internal publication',
    'children': [
      {
        'id': 10,
        'name': 'Designmeeting1', 'label': 'Designmeeting 1',
        'description': 'Elements shared after first meeting to discuss questionnaire.',
      },
      {
        'id': 11,
        'name': 'Designmeeting2', 'label': 'Designmeeting 2',
        'description': 'Elements shared after second meeting to discuss questionnaire.',
      },
      {
        'id': 12,
        'name': 'Designmeeting3', 'label': 'Designmeeting 3',
        'description': 'Elements shared  after third meeting to discuss questionnaire.',
      },
      {
        'id': 13,
        'name': 'EarlytestingSQPTMT', 'label': 'Earlytesting - SQP/TMT',
        'description': 'Elements agreed for early pre-testing, export to SQP and translation.',
      },
      {
        'id': 14,
        'name': 'PostEarlyTesting', 'label': 'PostEarlyTesting',
        'description': 'Elements reviewed on basis of the results from the early testing.',
      },
      {
        'id': 15,
        'name': 'PilotSQPTMT', 'label': 'Pilot – SQP/TMT',
        'description': 'Elements agreed for pilot, export to SQP and translation.',
      },
      {
        'id': 16,
        'name': 'PostPilot', 'label': 'PostPilot',
        'description': 'Elements reviewed on basis of the results from the pilot.',
      },
      {
        'id': 17,
        'name': 'FinalSourceSQPTMT', 'label': 'FinalSource – SQP/TMT',
        'description': 'Elements agreed as going into the final source questionnaire.',
      },
      {
        'id': 18,
        'name': 'NoMilestone', 'label': 'No Milestone',
        'description': 'Use for publication of elements between key milestones.',
      },
    ]
  },
  {
    'id': 2, 'name': 'EXTERNALPUBLICATION', 'label': 'External publication',
    'children': [
      {
        'id': 20,
        'name': 'ExportToPublic_History', 'label': 'Export to Public History',
        'description': 'In addition to the final elements, '
        + 'the development history will be made available to the public. '
        + 'The published development history might however be an edited '
        + 'version of the development process that is stored in the database.'
      },
      {
        'id': 21,
        'name': 'ExportToPublic', 'label': 'Export to Public',
        'description': 'Elements agreed as going into the final source questionnaire.'
      },
      {
        'id': 22,
        'name': 'ExportToQVDB', 'label': 'Export to QVDB',
        'description': 'Once finalized, elements will be exported to the QVDB to be made publically available'
      }]
  }
];

export const PUBLICATION_TYPES: QddtElementType[] = [
  QddtElementTypes[ElementKind.TOPIC_GROUP],
  QddtElementTypes[ElementKind.CONCEPT],
  QddtElementTypes[ElementKind.QUESTIONITEM],
  QddtElementTypes[ElementKind.QUESTION_CONSTRUCT],
  QddtElementTypes[ElementKind.SEQUENCE_CONSTRUCT],
];

export class PublicationElement {
  id: string;
  revisionNumber: number;
  elementKind: ElementKind;
  name:string;
  element:any;
}

export class Publication {
  id: string;
  name: string;
  purpose: string;
  status: string;
  publicationElements: PublicationElement[];
}

@Injectable()
export class PublicationService extends BaseService {

  readonly pageSize = '&size=15';

  constructor(protected http:Http, @Inject(API_BASE_HREF) protected api:string) {
    super(http ,api);
  }

  create(p: Publication): any {
    return this.post(p, 'publication/create');
  }

  update(p: Publication): any {
    return this.post(p, 'publication/');
  }

  getAll(page: String = '0'): any {
    return this.get('publication/page' + this.pageSize);
  }

  getPublication(id: string): any {
    return this.get('publication/' + id);
  }

  getPublicationStatus():any {
    return this.get('publicationstatus/list');
  }
  searchPublications(name: string = '', page: String = '0', sort: String = ''): any {
    let queries: any[] = [];
    if(name.length > 0) {
      queries.push('name=' + '*' + name +'*' + '&status=' + '*' + name +'*');
    }
    if (sort.length > 0) {
      queries.push('sort=' + sort);
    }
    if(page !== '0') {
      queries.push('page=' + page);
    }
    let query: string = '';
    if(queries.length > 0) {
      query = '?' + queries.join('&');
    }
    return this.get('publication/page/search' + query);
  }

  searchElements(elementKind: ElementKind, name: string) {
    let query = '?';
    let e: any = PUBLICATION_TYPES.find(e => e.id === elementKind);
    if (e !== undefined) {
      if (name.length > 0) {
        let fields: any[] = e.fields;
        for (let i = 0; i < fields.length; i++) {
          query += '&' + fields[i] + '=*' + name + '*';
        }
      }
      if(e.parameter) {
        query += e.parameter;
      }
      return this.get(e.path + '/page/search' + query);
    }
    return Observable.of([]);
  }

  getByTopic(topicId: string) : any {
    return this.get('concept/page/by-topicgroup/'+ topicId + '?page=0&size=50&sort=asc');
  }

  getElementRevisions(elementKind: ElementKind, id: string) : any {
    let e: any = PUBLICATION_TYPES.find(e => e.id === elementKind);
    if (e !== undefined) {
      return this.get('audit/' + e.path + '/' + id + '/all');
    }
    return Observable.of([]);
  }


  getFile(id: string) {
    let headers = new Headers();
    let jwt = localStorage.getItem('jwt');
    if(jwt !== null) {
      headers.append('Authorization', 'Bearer  ' + JSON.parse(jwt).access_token);
    }
    let options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Blob });
    return this.http.get(this.api + 'othermaterial/files/' + id, options)
      .map(res => res.blob())
      .catch(this.handleError);
  }

  getQuestionitem(id: string): any {
    return this.get('questionitem/' + id);
  }

  getPdf(id: string): any {
    let headers = new Headers();
    let jwt = localStorage.getItem('jwt');
    if(jwt !== null) {
      headers.append('Authorization', 'Bearer  ' + JSON.parse(jwt).access_token);
    }
    let options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Blob });
    return this.http.get(this.api + 'publication/pdf/' + id, options)
      .map(res => res.blob())
      .catch(this.handleError);
  }

}
