import { QueryInfo } from '../classes';
import { ElementKind } from '../enums';
import { IHeaderDetail } from '../interfaces';

export const QDDT_QUERY_INFOS: QueryInfo[] = [
  new QueryInfo(ElementKind.NONE, '', '', '', [], null),
  new QueryInfo(
    ElementKind.CATEGORY,
    'Category',
    'category',
    'categories',
    ['label', 'name', 'description'],
    '&categoryKind=CATEGORY'
  ),
  new QueryInfo(
    ElementKind.MISSING_GROUP,
    'Missing Values',
    'category',
    'categories',
    ['label', 'name', 'description'],
    '&categoryKind=MISSING_GROUP'
  ),
  new QueryInfo(
    ElementKind.CONCEPT,
    'Concept',
    'concept',
    'concepts',
    ['label', 'name', 'description'],
    null,
    "topicgroup"
  ),
  new QueryInfo(
    ElementKind.CONTROL_CONSTRUCT,
    'Construct',
    'controlconstruct',
    'controlConstructs',
    ['label', 'name'],
    '&constructKind=CONTROL_CONSTRUCT'
  ),
  new QueryInfo(
    ElementKind.CONDITION_CONSTRUCT,
    'Condition',
    'controlconstruct',
    'controlConstructs',
    ['label', 'name', 'description'],
    '&constructKind=CONDITION_CONSTRUCT'
  ),
  new QueryInfo(
    ElementKind.QUESTION_CONSTRUCT,
    'QuestionConstruct',
    'controlconstruct',
    'questionConstructs',
    ['label', 'name', 'questionName', 'questionText'],
    '&constructKind=QUESTION_CONSTRUCT'
  ),
  new QueryInfo(
    ElementKind.SEQUENCE_CONSTRUCT,
    'Sequence',
    'controlconstruct',
    'controlConstructs',
    ['label', 'name', 'description', 'sequenceKind'],
    '&constructKind=SEQUENCE_CONSTRUCT'
  ),
  new QueryInfo(
    ElementKind.STATEMENT_CONSTRUCT,
    'Statement',
    'controlconstruct',
    'controlConstructs',
    ['label', 'name', 'description'],
    '&constructKind=STATEMENT_CONSTRUCT'
  ),
  new QueryInfo(
    ElementKind.INSTRUMENT,
    'Instrument',
    'instrument',
    'instruments',
    ['label', 'name', 'description', 'kind'],
    null
  ),
  new QueryInfo(
    ElementKind.PUBLICATION,
    'Publication',
    'publication',
    'publications',
    ['name', 'purpose', 'publicationStatus'],
    null
  ),
  new QueryInfo(
    ElementKind.QUESTION_GRID,
    'QuestionGrid',
    'questiongrid',
    'questionGrids',
    ['label', 'name', 'question'],
    null
  ),
  new QueryInfo(
    ElementKind.QUESTION_ITEM,
    'QuestionItem',
    'questionitem',
    'questionItems',
    ['label', 'name', 'question', 'responseDomainName'],
    null
  ),
  new QueryInfo(
    ElementKind.RESPONSEDOMAIN,
    'ResponseDomain',
    'responsedomain',
    'responseDomains',
    ['label', 'name', 'description', 'question', 'anchor'],
    null
  ),
  new QueryInfo(
    ElementKind.STUDY,
    'Study',
    'study',
    'studies',
    ['label', 'name', 'description'],
    null,
    "surveyprogram"
  ),
  new QueryInfo(
    ElementKind.SURVEY_PROGRAM,
    'Survey',
    'surveyprogram',
    'surveyPrograms',
    ['label', 'name', 'description'],
    null
  ),
  new QueryInfo(
    ElementKind.TOPIC_GROUP,
    'Module',
    'topicgroup',
    'topicGroups',
    ['label', 'name', 'description'],
    null,
    "study"
  ),
  new QueryInfo(
    ElementKind.INSTRUCTION,
    'Instruction',
    'instruction',
    'instructions',
    ['description'],
    null
  ),
  new QueryInfo(
    ElementKind.UNIVERSE,
    'Universe',
    'universe',
    'universes',
    ['description'],
    null
  ),
  new QueryInfo(ElementKind.USER, 'User', 'user', 'users', ['name'], null),
  new QueryInfo(
    ElementKind.CHANGE_LOG,
    'Feed',
    'changelog',
    'changeFeeds',
    ['name', 'kind', 'changeKind'],
    null
  ),
  new QueryInfo(
    ElementKind.AUTHOR,
    'Author',
    'author',
    'authors',
    ['name', 'email'],
    null
  ),
  new QueryInfo(
    ElementKind.REFERENCED,
    'References',
    'reference',
    'references',
    ['kind'],
    null
  ),
  new QueryInfo(
    ElementKind.AGENCY,
    'Agency',
    'agency',
    'agencies',
    ['name'],
    null
  )
];

export const HEADER_DETAILS = new Map<string, IHeaderDetail>([
  ['categories',{ icon: 'view_comfy', headerName: 'Categories', kind: ElementKind.CATEGORY }],
  ['missing',{ icon: 'check_box_outline_blank',headerName: 'Missing Values',kind: ElementKind.MISSING_GROUP }],
  ['questionitems',{ icon: 'help',headerName: 'QuestionItems',kind: ElementKind.QUESTION_ITEM }],
  ['questions',{ icon: 'help_outline',headerName: 'Question constructs',kind: ElementKind.QUESTION_CONSTRUCT }],
  ['sequences',{ icon: 'view_list',headerName: 'Sequence constructs',kind: ElementKind.SEQUENCE_CONSTRUCT }],
  ['conditions',{ icon: 'device_hub',headerName: 'Condition constructs',kind: ElementKind.CONDITION_CONSTRUCT }],
  ['statements',{ icon: 'record_voice_over', headerName: 'Statements',kind: ElementKind.STATEMENT_CONSTRUCT }],
  ['responsedomains',{ icon: 'check_box',headerName: 'Response domains',kind: ElementKind.RESPONSEDOMAIN }],
  ['instruments',{ icon: 'tablet_mac',headerName: 'Instruments',kind: ElementKind.INSTRUMENT }],
  ['publications', { icon: 'folder_special', headerName: 'Publication packages', kind: ElementKind.PUBLICATION }],
  ['instructions', { icon: 'speaker_notes', headerName: 'Instructions', kind: ElementKind.INSTRUCTION }],
  ['universes', { icon: 'public', headerName: 'Universes', kind: ElementKind.UNIVERSE }],
  ['user', { icon: 'user', headerName: 'User Administration', kind: ElementKind.USER }],
  ['changelog', { icon: 'timeline', headerName: 'Change Feed', kind: ElementKind.CHANGE_LOG }],
  ['referenced', { icon: 'insert_link', headerName: 'Referenced', kind: ElementKind.REFERENCED }],
  ['authors', { icon: 'face', headerName: 'Authors', kind: ElementKind.AUTHOR }],
  ['agencies', { icon: 'verified_user', headerName: 'Agencies', kind: ElementKind.AGENCY }],
  ['module', { icon: 'looks_two', headerName: 'Modules', kind: ElementKind.TOPIC_GROUP }],
  ['concept', { icon: 'looks_3', headerName: 'Concepts', kind: ElementKind.CONCEPT }]
]);
