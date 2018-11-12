import { Column } from './table.column';
import { DomainKind } from '../../modules/responsedomain/responsedomain.classes';
import { ElementKind } from '../../classes';

export const DEFAULT_COLUMNS = [
  new Column({ name: 'modified',  label: 'Modified', sortable: true, direction: 'desc' }),
  new Column({ name: 'version',  label: 'Version' }),
  new Column({ name: ['modifiedBy', 'agencyUserName'],  label: 'User@Agency' })
];

const LOOKUP_COLUMNS =  [
  new Column( { label: 'Name', name: 'name', sortable: true }),
  new Column( { label: 'Description', name: 'description', sortable: true }),
];

const  QUESTION_CONSTRUCT_COLUMNS = [
  new Column({ name: 'name', label: 'Construct Name', sortable: true }),
  new Column({ name: 'questionName', label: 'Question Name', sortable: true }),
  new Column({ name: 'questionText', label: 'Question Text', sortable: true }),
];

const  SEQUENCE_CONSTRUCT_COLUMNS = [
  new Column({ label: 'Name', name: 'name', sortable: true }),
  new Column({ label: 'Description', name: 'description', sortable: true }),
];

const  PUBLICATION_COLUMNS =  [
  new Column({ name: 'name', label: 'Name', sortable: true }),
  new Column({ name: 'purpose', label: 'Purpose', sortable: true }),
  new Column({ name: ['status', 'label'], label: 'Publication Status', sortable: false }),
];

const CATEGORY_COLUMNS =  [
  new Column( { name: 'label', label: 'Label', sortable: true }),
  new Column( { name: 'description', label: 'Description', sortable: true }),
  new Column( { name: 'categoryType', label: 'Type',  sortable: true } ),
];

const QUESTIONITEM_COLUMNS = [
  new Column( { name: 'name', label: 'Name', sortable: true }),
  new Column( { name: 'question', label: 'Question Text', sortable: true }),
  new Column( { name: 'responseDomainName', label: 'ResponseDomain', sortable: true }),
];

const INSTRUMENT_COLUMNS = [
  new Column( { name: 'label', label: 'Name', sortable: true }),
  new Column( { name: 'description', label: 'Description', sortable: true }),
  new Column( { name: 'instrumentKind', label: 'Kind', sortable: true }),
];

export const USER_COLUMNS = [
  new Column( { name: 'name', label: 'Name', sortable: true }),
  new Column( { name: 'email', label: 'Email', sortable: true }),
  new Column( { name: 'enabled', label: 'Active', sortable: false }),
  new Column( { name: ['authorities', 'name'], label: 'Authority', sortable: false }),
  new Column( { name: 'modified',  label: 'Modified', sortable: true, direction: 'desc' }),
  new Column( { name: ['agency', 'name'], label: 'Agency', sortable: true })
];

export const CHANGE_LOG_COLUMNS = [
  new Column( { name: 'name', label: 'Name', sortable: true }),
  new Column( { name: 'modified',  label: 'Modified', sortable: true, direction: 'desc' }),
  new Column( { name: ['modifiedBy', 'name'],  label: 'ModifiedBy', sortable: false }),
  new Column( { name: 'refAction',  label: 'refAction', sortable: true}),
  new Column( { name: 'refKind',  label: 'refKind', sortable: true }),
  new Column( { name: 'refChangeKind',  label: 'refChangeKind', sortable: true }),
  ];
//   changeFeedKey?: {};
// elementId?: string;
// elementKind?: ElementKind;
// elementRevision?: number;
// modifiedBy?: User;
// name: String;
// refAction?: number;
// ?: any;
// ?: String;
// ?: number;];

const SCALE =  [
    new Column( { label: 'Scale Domain Name', name: 'name', sortable: true} ),
    new Column( { label: 'Description', name: 'description', sortable: true} ),
    new Column( { label: 'N', name: ['managedRepresentation', 'children', 'length'], sortable: false} ),
    new Column( { label: 'Start', name: ['managedRepresentation', 'inputLimit', 'minimum'], sortable: false} ),
    new Column( { label: 'End', name: ['managedRepresentation', 'inputLimit', 'maximum'], sortable: false} ),
    new Column( { label: 'Anchors', name: 'anchorLabel', sortable: false} ),
  ];

const LIST = [
    new Column( { label: 'Code Domain Name', name: 'name', sortable: true} ),
    new Column( { label: 'Description', name: 'description', sortable: true} ),
    new Column( { label: 'Number of Codes', name: ['managedRepresentation', 'children', 'length'], sortable: false} ),
  ];

const NUMERIC = [
    new Column( { label: 'Numeric Domain Name', name: 'name', sortable: true} ),
    new Column( { label: 'Description', name: 'description', sortable: true} ),
    new Column( { label: 'Low', name: ['managedRepresentation', 'inputLimit', 'minimum'], sortable: false} ),
    new Column( { label: 'High', name: ['managedRepresentation', 'inputLimit', 'maximum'], sortable: false} ),
  ];

const TEXT = [
    new Column( { label: 'Text Domain Name', name: 'name', sortable: true} ),
    new Column( { label: 'Description', name: 'description', sortable: true} ),
    new Column( { label: 'Min Length', name: ['managedRepresentation', 'inputLimit', 'minimum'], sortable: false} ),
    new Column( { label: 'Max Length', name: ['managedRepresentation', 'inputLimit', 'maximum'], sortable: false} ),
  ];

const DATETIME = [
    new Column( { label: 'DateTime Domain Name', name: 'name', sortable: true} ),
    new Column( { label: 'Description', name: 'description', sortable: true} ),
    new Column( { label: 'Low', name: ['managedRepresentation', 'inputLimit', 'minimum'], sortable: false} ),
    new Column( { label: 'High', name: ['managedRepresentation', 'inputLimit', 'maximum'], sortable: false} ),
  ];


export const RESPONSEDOMAIN_COLUMNS:  Map<DomainKind, Column[]>  = new Map([
  [DomainKind.SCALE, SCALE.concat(DEFAULT_COLUMNS) ],
  [DomainKind.LIST, LIST.concat(DEFAULT_COLUMNS) ],
  [DomainKind.NUMERIC, NUMERIC.concat(DEFAULT_COLUMNS) ],
  [DomainKind.TEXT, TEXT.concat(DEFAULT_COLUMNS) ],
  [DomainKind.DATETIME, DATETIME.concat(DEFAULT_COLUMNS) ],
]);


export const LIST_COLUMNS: Map<ElementKind, Column[]>  = new Map([
  [ElementKind.QUESTION_ITEM, QUESTIONITEM_COLUMNS.concat(DEFAULT_COLUMNS) ],
  [ElementKind.CATEGORY, CATEGORY_COLUMNS.concat(DEFAULT_COLUMNS) ],
  [ElementKind.MISSING_GROUP, CATEGORY_COLUMNS.concat(DEFAULT_COLUMNS) ],
  [ElementKind.RESPONSEDOMAIN, null ],
  [ElementKind.QUESTION_CONSTRUCT, QUESTION_CONSTRUCT_COLUMNS.concat(DEFAULT_COLUMNS) ],
  [ElementKind.SEQUENCE_CONSTRUCT, SEQUENCE_CONSTRUCT_COLUMNS.concat(DEFAULT_COLUMNS) ],
  [ElementKind.INSTRUMENT, INSTRUMENT_COLUMNS.concat(DEFAULT_COLUMNS) ],
  [ElementKind.PUBLICATION, PUBLICATION_COLUMNS.concat(DEFAULT_COLUMNS) ],
  [ElementKind.UNIVERSE, LOOKUP_COLUMNS.concat(DEFAULT_COLUMNS) ],
  [ElementKind.INSTRUCTION, LOOKUP_COLUMNS.concat(DEFAULT_COLUMNS) ],
  [ElementKind.USER, USER_COLUMNS ],
  [ElementKind.CHANGE_LOG, CHANGE_LOG_COLUMNS ],
]);

