import { QueryInfo } from '../classes';
import { ElementKind } from '../enums';
import { IHeaderDetail } from '../interfaces';

export const QDDT_QUERY_INFOES: QueryInfo[] = [
  new QueryInfo(ElementKind.NONE, '', '', [], null),
  new QueryInfo(
    ElementKind.CATEGORY,
    'Category',
    'category',
    ['label', 'description'],
    '&categoryKind=CATEGORY'
  ),
  new QueryInfo(
    ElementKind.MISSING_GROUP,
    'Missing Values',
    'category',
    ['label', 'description'],
    '&categoryKind=MISSING_GROUP'
  ),
  new QueryInfo(
    ElementKind.CONCEPT,
    'Concept',
    'concept',
    ['name', 'description'],
    null
  ),
  new QueryInfo(
    ElementKind.CONTROL_CONSTRUCT,
    'Construct',
    'controlconstruct',
    ['name'],
    '&constructKind=CONTROL_CONSTRUCT'
  ),
  new QueryInfo(
    ElementKind.CONDITION_CONSTRUCT,
    'Condition',
    'controlconstruct',
    ['name', 'condition'],
    '&constructKind=CONDITION_CONSTRUCT'
  ),
  new QueryInfo(
    ElementKind.QUESTION_CONSTRUCT,
    'QuestionConstruct',
    'controlconstruct',
    ['name', 'questionName', 'questionText'],
    '&constructKind=QUESTION_CONSTRUCT'
  ),
  new QueryInfo(
    ElementKind.SEQUENCE_CONSTRUCT,
    'Sequence',
    'controlconstruct',
    ['name', 'description', 'sequenceKind'],
    '&constructKind=SEQUENCE_CONSTRUCT'
  ),
  new QueryInfo(
    ElementKind.STATEMENT_CONSTRUCT,
    'Statement',
    'controlconstruct',
    ['name', 'statment'],
    '&constructKind=STATEMENT_CONSTRUCT'
  ),
  new QueryInfo(
    ElementKind.INSTRUMENT,
    'Instrument',
    'instrument',
    ['label', 'description', 'kind'],
    null
  ),
  new QueryInfo(
    ElementKind.PUBLICATION,
    'Publication',
    'publication',
    ['name', 'purpose', 'publicationStatus'],
    null
  ),
  new QueryInfo(
    ElementKind.QUESTION_GRID,
    'QuestionGrid',
    'questiongrid',
    ['name', 'question'],
    null
  ),
  new QueryInfo(
    ElementKind.QUESTION_ITEM,
    'QuestionItem',
    'questionitem',
    ['name', 'question', 'responseDomainName'],
    null
  ),
  new QueryInfo(
    ElementKind.RESPONSEDOMAIN,
    'ResponseDomain',
    'responsedomain',
    ['name', 'description', 'question', 'anchor'],
    null
  ),
  new QueryInfo(
    ElementKind.STUDY,
    'Study',
    'study',
    ['name', 'description'],
    null
  ),
  new QueryInfo(
    ElementKind.SURVEY_PROGRAM,
    'Survey',
    'surveyprogram',
    ['name', 'description'],
    null
  ),
  new QueryInfo(
    ElementKind.TOPIC_GROUP,
    'Module',
    'topicgroup',
    ['name', 'description'],
    null
  ),
  new QueryInfo(
    ElementKind.INSTRUCTION,
    'Instruction',
    'instruction',
    ['description'],
    null
  ),
  new QueryInfo(
    ElementKind.UNIVERSE,
    'Universe',
    'universe',
    ['description'],
    null
  ),
  new QueryInfo(ElementKind.USER, 'User', 'user', ['name'], null),
  new QueryInfo(
    ElementKind.CHANGE_LOG,
    'Feed',
    'changelog',
    ['name', 'change', 'kind'],
    null
  ),
  new QueryInfo(
    ElementKind.AUTHOR,
    'Author',
    'author',
    ['name', 'about', 'email'],
    null
  ),
  new QueryInfo(
    ElementKind.REFERENCED,
    'References',
    'references',
    ['kind'],
    null
  ),
  new QueryInfo(
    ElementKind.AGENCY,
    'Agency',
    'agency',
    ['name'],
    null
  )
];

export const HEADER_DETAILS = new Map<string, IHeaderDetail>([
  [
    'categories',
    { icon: 'view_comfy', headerName: 'Categories', kind: ElementKind.CATEGORY }
  ],
  [
    'missing',
    {
      icon: 'check_box_outline_blank',
      headerName: 'Missing Values',
      kind: ElementKind.MISSING_GROUP
    }
  ],
  [
    'questionitems',
    {
      icon: 'help',
      headerName: 'QuestionItems',
      kind: ElementKind.QUESTION_ITEM
    }
  ],
  [
    'questions',
    {
      icon: 'help_outline',
      headerName: 'Question constructs',
      kind: ElementKind.QUESTION_CONSTRUCT
    }
  ],
  [
    'sequences',
    {
      icon: 'format_line_spacing',
      headerName: 'Sequence constructs',
      kind: ElementKind.SEQUENCE_CONSTRUCT
    }
  ],
  [
    'conditions',
    {
      icon: 'device_hub',
      headerName: 'Condition constructs',
      kind: ElementKind.CONDITION_CONSTRUCT
    }
  ],
  [
    'statements',
    {
      icon: 'record_voice_over',
      headerName: 'Statements',
      kind: ElementKind.STATEMENT_CONSTRUCT
    }
  ],
  [
    'responsedomains',
    {
      icon: 'check_box',
      headerName: 'Response domains',
      kind: ElementKind.RESPONSEDOMAIN
    }
  ],
  [
    'instruments',
    {
      icon: 'tablet_mac',
      headerName: 'Instruments',
      kind: ElementKind.INSTRUMENT
    }
  ],
  [
    'publications',
    {
      icon: 'folder_special',
      headerName: 'Publication packages',
      kind: ElementKind.PUBLICATION
    }
  ],
  [
    'instructions',
    {
      icon: 'speaker_notes',
      headerName: 'Instructions',
      kind: ElementKind.INSTRUCTION
    }
  ],
  [
    'universes',
    { icon: 'public', headerName: 'Universes', kind: ElementKind.UNIVERSE }
  ],
  [
    'user',
    { icon: 'user', headerName: 'User Administration', kind: ElementKind.USER }
  ],
  ['changelog', { icon: 'timeline', headerName: 'Change Feed', kind: ElementKind.CHANGE_LOG }],
  ['referenced', { icon: 'insert_link', headerName: 'Referenced', kind: ElementKind.REFERENCED }],
  ['authors', { icon: 'face', headerName: 'Authors', kind: ElementKind.AUTHOR }],
  ['agencies', { icon: 'verified_user', headerName: 'Agencies', kind: ElementKind.AGENCY }],
  ['module', { icon: 'store', headerName: 'Modules', kind: ElementKind.TOPIC_GROUP }],
  ['concept', { icon: 'store', headerName: 'Concepts', kind: ElementKind.CONCEPT }]
]);
