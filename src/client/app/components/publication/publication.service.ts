import { Injectable, Inject } from '@angular/core';
import { Http } from '@angular/http';

import { API_BASE_HREF } from '../../api';
import { BaseService } from '../../common/base.service';

export const PublicationStatus: any = [
    { 'id': 0, 'name': 'NOTPUBLISHED', 'label':'Not Published', 'children': [],
      'description': 'Elements and discussion made available for key '
        + 'members of a questionnaire design sub'
        + ' group, but not designed to be published internally'},
    { 'id': 1, 'name': 'INTERNALPUBLICATION', 'label':'Internal publication',
      'children': [
      {
        'id': 10,
        'name': 'Designmeeting1', 'label': 'Designmeeting 1',
        'description': 'Elements shared after first meeting to discuss questionnaire.',
        'children': [],
      },
      {
        'id': 11,
        'name': 'Designmeeting2', 'label': 'Designmeeting 2',
        'description': 'Elements shared after second meeting to discuss questionnaire.',
        'children': [],
      },
      {
        'id': 12,
        'name': 'Designmeeting3', 'label': 'Designmeeting 3',
        'description': 'Elements shared  after third meeting to discuss questionnaire.',
        'children': [],
      },
      {
        'id': 13,
        'name': 'EarlytestingSQPTMT', 'label': 'Earlytesting - SQP/TMT',
        'description': 'Elements agreed for early pre-testing, export to SQP and translation.',
        'children': [],
      },
      {
        'id': 14,
        'name': 'PostEarlyTesting', 'label': 'PostEarlyTesting',
        'description': 'Elements reviewed on basis of the results from the early testing.',
        'children': [],
      },
      {
        'id': 15,
        'name': 'PostPilot – SQP/TMT', 'label': 'PostPilotSQPTMT',
        'description': 'Elements reviewed on basis of the results from the pilot, export to SQP testing and translation.',
        'children': [],
      },
      {
        'id': 16,
        'name': 'FinalSourceSQPTMT', 'label': 'FinalSource – SQP/TMT',
        'description': 'Elements agreed as going into the final source questionnaire.',
        'children': [],
      },
      {
        'id': 17,
        'name': 'NoMilestone', 'label': 'No Milestone',
        'description': 'Use for publication of elements between key milestones.',
        'children': [],
      },
      ]},
    { 'id': 2, 'name': 'EXTERNALPUBLICATION', 'label': 'External publication',
       'children': [
      {
        'id': 20,
        'name': 'ExportToPublic_History', 'label': 'Export to Public History',
        'description': 'In addition to the final elements, '
          + 'the development history will be made -available to the public. '
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

export class PublicationElement {
  id: string;
  revisionNumber: number;
  elementKind: string;
}

export class Publication {
  id: string;
  name: string;
  publicationKind: string;
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

}
