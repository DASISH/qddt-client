import { ElementKind } from './enums';
import { QueryInfo } from './classes';
import { IHeaderDetail } from './interfaces';

export  function getElementKind(kind: string|ElementKind): ElementKind {
  return (typeof kind === 'string') ?  ElementKind[kind] : kind ;
}

export  function getQueryInfo(kind: string|ElementKind): QueryInfo {
  const key = getElementKind(kind);
  return QDDT_QUERY_INFOES[key];
}

export const QDDT_QUERY_INFOES: QueryInfo[] = [
  new QueryInfo(ElementKind.NONE, '', '', [], null),
  new QueryInfo(ElementKind.CATEGORY, 'Category', 'category', ['name', 'description'], '&categoryKind=CATEGORY'),
  new QueryInfo(ElementKind.MISSING_GROUP, 'Missing Values', 'category', ['name', 'description'], '&categoryKind=MISSING_GROUP'),
  new QueryInfo(ElementKind.CONCEPT, 'Concept', 'concept', ['name', 'description'], null),
  new QueryInfo(ElementKind.CONTROL_CONSTRUCT, 'Construct', 'controlconstruct', ['name'],
    '&constructKind=CONTROL_CONSTRUCT'),
  new QueryInfo(ElementKind.CONDITION_CONSTRUCT, 'Condition', 'controlconstruct', ['name', 'condition'],
    '&constructKind=CONDITION_CONSTRUCT'),
  new QueryInfo(ElementKind.QUESTION_CONSTRUCT, 'QuestionConstruct', 'controlconstruct', ['name', 'questionName', 'questionText'],
    '&constructKind=QUESTION_CONSTRUCT'),
  new QueryInfo(ElementKind.SEQUENCE_CONSTRUCT, 'Sequence', 'controlconstruct', ['name', 'description', 'sequenceKind'],
    '&constructKind=SEQUENCE_CONSTRUCT'),
  new QueryInfo(ElementKind.STATEMENT_CONSTRUCT, 'Statement', 'controlconstruct', ['name', 'statment'],
    '&constructKind=STATEMENT_CONSTRUCT'),
  new QueryInfo(ElementKind.INSTRUMENT, 'Instrument', 'instrument', ['name', 'description', 'kind'], null),
  new QueryInfo(ElementKind.PUBLICATION, 'Publication', 'publication', ['name', 'purpose', 'publicationStatus'], null),
  new QueryInfo(ElementKind.QUESTION_GRID, 'QuestionGrid', 'questiongrid', ['name', 'question'], null),
  new QueryInfo(ElementKind.QUESTION_ITEM, 'QuestionItem', 'questionitem', ['name', 'question', 'responseDomainName'], null),
  new QueryInfo(ElementKind.RESPONSEDOMAIN, 'ResponseDomain', 'responsedomain', ['name', 'description', 'question', 'anchor'], null),
  new QueryInfo(ElementKind.STUDY, 'Study', 'study', ['name', 'description'], null),
  new QueryInfo(ElementKind.SURVEY_PROGRAM, 'Survey', 'surveyprogram', ['name', 'description'], null),
  new QueryInfo(ElementKind.TOPIC_GROUP, 'Module', 'topicgroup', ['name', 'description'], null),
  new QueryInfo(ElementKind.INSTRUCTION, 'Instruction', 'instruction', ['description'], null),
  new QueryInfo(ElementKind.UNIVERSE, 'Universe', 'universe', ['description'], null),
  new QueryInfo(ElementKind.USER, 'User', 'user', ['name'], null),
];


export  const HEADER_DETAILS: Map<string, IHeaderDetail>  = new Map([
  ['categories', { icon: 'view_comfy', headerName: 'Categories', kind: ElementKind.CATEGORY }],
  ['missing', { icon: 'view_module', headerName: 'Missing Values', kind: ElementKind.MISSING_GROUP }],
  ['questionitems', { icon: 'help', headerName: 'QuestionItems' , kind: ElementKind.QUESTION_ITEM}],
  ['questions', { icon: 'view_agenda', headerName: 'Question constructs' , kind: ElementKind.QUESTION_CONSTRUCT}],
  ['sequences', { icon: 'format_line_spacing', headerName: 'Sequence constructs', kind: ElementKind.SEQUENCE_CONSTRUCT }],
  ['responsedomains', { icon: 'blur_linear', headerName: 'Response domains', kind: ElementKind.RESPONSEDOMAIN }],
  ['instruments', { icon: 'tablet_mac', headerName: 'Instruments', kind: ElementKind.INSTRUMENT }],
  ['publications', { icon: 'folder_special', headerName: 'Publication packages', kind: ElementKind.PUBLICATION }],
  ['instructions', { icon: 'speaker_notes', headerName: 'Instructions', kind: ElementKind.INSTRUCTION }],
  ['universes', { icon: 'public', headerName: 'Universes', kind: ElementKind.UNIVERSE }],
  ['user', { icon: 'user', headerName: 'User Administration', kind: ElementKind.USER }],
]);
