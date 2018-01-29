import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { API_BASE_HREF } from '../api';
import { ElementKind, QddtElement, QddtElements } from '../preview/preview.service';

export const PUBLICATION_NOT_PUBLISHED = { 'id': 0, 'name': 'NOTPUBLISHED', 'label': 'Not Published', 'children': [],
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

export const PUBLICATION_TYPES: QddtElement[] = [
  QddtElements[ElementKind.TOPIC_GROUP],
  QddtElements[ElementKind.CONCEPT],
  QddtElements[ElementKind.QUESTIONITEM],
  QddtElements[ElementKind.QUESTION_CONSTRUCT],
  QddtElements[ElementKind.SEQUENCE_CONSTRUCT],
];

export class PublicationElement {
  id: string;
  revisionNumber: number;
  elementKind: ElementKind;
  name: string;
  element: any;
}

export class Publication {
  id: string;
  name: string;
  purpose: string;
  status: string;
  publicationElements: PublicationElement[];
  constructor() {
    this.publicationElements = [];
  }
}

@Injectable()
export class PublicationService {

  readonly pageSize = '&size=15';

  constructor(protected http: HttpClient, @Inject(API_BASE_HREF) protected api: string) {
  }

  getByTopic(topicId: string): Promise<any> {
    return this.http.get(this.api +'concept/page/by-topicgroup/' + topicId + '?page=0&size=50&sort=asc')
      .toPromise();
  }

  getElementRevisions(elementKind: ElementKind, id: string): Promise<any> {
    const e: any = PUBLICATION_TYPES.find(e => e.id === elementKind);
    if (e !== undefined) {
      if (elementKind === ElementKind.CONCEPT || elementKind === ElementKind.TOPIC_GROUP)
        return this.http.get(this.api +'audit/' + e.path + '/' + id + '/allinclatest').toPromise();
      else
        return this.http.get(this.api +'audit/' + e.path + '/' + id + '/all').toPromise();
    }
    return new Promise(null);
  }

  getQuestionitem(id: string): Promise<any> {
    return this.http.get(this.api +'questionitem/' + id).toPromise();
  }

  getAll(page: String = '0'): Promise<any> {
    return this.http.get(this.api +'publication/page/' + this.pageSize).toPromise();
  }

  getPublication(id: string): Promise<any> {
    return this.http.get(this.api +'publication/' + id).toPromise();
  }

  getPublicationStatus(): Promise<any> {
    return this.http.get(this.api +'publicationstatus/list').toPromise();
  }

  searchPublications(name: string = '', page: String = '0', sort: String = ''): Promise<any> {
    const queries: any[] = [];
    if (name.length > 0) {
      queries.push('name=' + '*' + name + '*' + '&status=' + '*' + name + '*');
    }
    if (sort.length > 0) {
      queries.push('sort=' + sort);
    }
    if (page !== '0') {
      queries.push('page=' + page);
    }
    let query = '';
    if (queries.length > 0) {
      query = '?' + queries.join('&');
    }
    return this.http.get(this.api +'publication/page/search/' + query).toPromise();
  }

  searchElements(elementKind: ElementKind, name: string): Promise<any> {
    let query = '?';
    const e: any = PUBLICATION_TYPES.find(e => e.id === elementKind);
    if (e !== undefined) {
      if (name.length > 0) {
        const fields: any[] = e.fields;
        for (let i = 0; i < fields.length; i++) {
          query += '&' + fields[i] + '=*' + name + '*';
        }
      }
      if (e.parameter) {
        query += e.parameter;
      }
      return this.http.get(this.api +e.path + '/page/search/' + query).toPromise();
    }
    return null;
  }

  getFile(id: string) :Promise<Blob> {
    return this.http.get(this.api + 'othermaterial/files/' + id,{responseType:'blob'})
      .toPromise();
  }

  getPdf(id: string): Promise<Blob> {
    return this.http.get(this.api + 'publication/pdf/' + id, {responseType:'blob'})
      .toPromise();
  }

  create(publication: Publication): Observable<any> {
    return this.http.post( this.api +'publication/create/',publication);
  }

  update(publication: Publication): Observable<any> {
    return this.http.post(this.api +'publication/',publication);
  }

}
