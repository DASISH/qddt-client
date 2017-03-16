import { Injectable, Inject } from '@angular/core';
import { Http } from '@angular/http';

import { API_BASE_HREF } from '../../api';
import { BaseService } from '../../common/base.service';
import { Observable }     from 'rxjs/Observable';

export const DEMO: any = {
  'id': '80b4dc27-7d06-4560-845d-4eff9b0758a4',
  'modified': [2017, 3, 15, 15, 17, 22, 550000000],
  'modifiedBy': {
    'id': '83d4c30a-4ff9-11e5-885d-feff819cdc9f',
    'username': 'yong',
    'email': 'yong@nsd.no',
    'agency': {
      'id': '1359dede-9f18-11e5-8994-feff819cdc9f',
      'modified': [2016, 9, 28, 12, 0],
      'modifiedBy': null,
      'name': 'NSD-qddt'
    }
  },
  'agency': {
    'id': '1359dede-9f18-11e5-8994-feff819cdc9f',
    'modified': [2016, 9, 28, 12, 0],
    'modifiedBy': null,
    'name': 'NSD-qddt'
  },
  'name': 'p5',
  'basedOnObject': null,
  'basedOnRevision': null,
  'version': {
    'major': 1,
    'minor': 0,
    'versionLabel': '',
    'revision': null
  },
  'changeKind': 'CREATED',
  'changeComment': null,
  'purpose': 'Fake demo data at front end',
  'status': 'PostPilot',
  'publicationElements': [{
    'id': '7f000101-54aa-131e-8155-0b37cc27000a',
    'revisionNumber': 767,
    'elementKind': 'TOPIC_GROUP',
    'element': {
      'name' : 'Welfare (Repeat)',
      'basedOnObject' : null,
      'basedOnRevision' : null,
      'version' : {
        'major' : 0,
        'minor' : 1,
        'versionLabel' : '',
        'revision' : null
      }
    }
  }]
};

export const PUBLICATIONNOTPUBLISHED = { 'id': 0, 'name': 'NOTPUBLISHED', 'label':'Not Published', 'children': [],
  'description': 'Elements and discussion made available for key '
    + 'members of a questionnaire design sub'
    + ' group, but not designed to be published internally'};

export const PublicationStatus: any = [
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

export const ElementTypes: any[] = [
    {'id': 1, 'label': 'Module', 'path': 'topicgroup',
      'type': 'TOPIC_GROUP',
      'fields': ['name', 'description']},
    {'id': 2, 'label': 'Concept', 'path': 'concept',
      'type': 'CONCEPT',
      'fields': ['name', 'description']},
    {'id': 3, 'label': 'QuestionItem', 'path': 'questionitem',
      'type': 'QUESTION_ITEM',
      'fields': ['name', 'question']},
    {'id': 4, 'label': 'QuestionConstruct', 'path': 'controlconstruct',
      'type': 'CONTROL_CONSTRUCT',
      'fields': ['name', 'questiontext'], 'parameter': '&constructkind=QUESTION_CONSTRUCT'},
    {'id': 5, 'label': 'Sequence', 'path': 'controlconstruct',
      'type': 'CONTROL_CONSTRUCT',
      'fields': ['name', 'description'], 'parameter': '&constructkind=SEQUENCE_CONSTRUCT'},
    {'id': 6, 'label': 'Instrument', 'path': 'instrument',
      'type': 'INSTRUMENT',
      'fields': ['name', 'description']}
  ];

export class PublicationElement {
  id: string;
  revisionNumber: number;
  elementKind: string;
}

export class Publication {
  id: string;
  name: string;
  purpose: string;
  status: string;
  publicationElements: any[];
}

@Injectable()
export class PublicationService extends BaseService {

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
    return this.get('publication/page');
  }

  getPublication(id: string): any {
    return this.get('publication/' + id);
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

  getElements(elementTypeId: number, name: string) {
    let query = '?';
    let e: any = ElementTypes.find(e => e.id === elementTypeId);
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

  getElementRevisions(elementTypeId: number, id: string) : any {
    let e: any = ElementTypes.find(e => e.id === elementTypeId);
    if (e !== undefined) {
      return this.get('audit/' + e.path + '/' + id + '/all');
    }
    return Observable.of([]);
  }

}
