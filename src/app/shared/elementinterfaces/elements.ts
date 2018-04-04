import { IVersion } from './entityaudit';

export interface IRevisionRef {
  elementId: any;
  elementRevision: number;
  elementKind: ElementKind|string;
}

export interface IElementRef {
  elementKind: ElementKind|string;
  element: any;
}

export class ElementRevisionRef implements IRevisionRef, IElementRef {
  elementId: any;
  elementRevision: number;
  elementKind: ElementKind | string;
  element: any;
  name?: string;
  version?: IVersion;
}

export enum ElementKind {
  CATEGORY = 0,
  CONCEPT,
  CONDITION_CONSTRUCT,
  QUESTION_CONSTRUCT,
  SEQUENCE_CONSTRUCT,
  STATEMENT_CONSTRUCT,
  INSTRUMENT,
  PUBLICATION,
  QUESTION_GRID,
  QUESTION_ITEM,
  RESPONSEDOMAIN,
  STUDY,
  SURVEY_PROGRAM,
  TOPIC_GROUP,
  INSTRUCTION,
  UNIVERSE
}

export class QddtElement {
  id: ElementKind;
  label: string;
  path: string;
  fields: any[];
  parameter: string;

  constructor(id: ElementKind, label: string, path: string, fields: any[], parameter: string) {
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
    let message = 'Searches in [';
    this.fields.forEach(o => {
      message += o + ' and ';
    });
    return message.slice(0, message.length - 5) + ']';
  }
}

export const QDDT_ELEMENTS: QddtElement[] = [
  new QddtElement(ElementKind.CATEGORY, 'Category', 'category', ['name'], null),
  new QddtElement(ElementKind.CONCEPT, 'Concept', 'concept', ['name'], null),
  new QddtElement(ElementKind.CONDITION_CONSTRUCT, 'Condition', 'controlconstruct', ['condition', 'name'],
     '&constructkind=CONDITION_CONSTRUCT'),
  new QddtElement(ElementKind.QUESTION_CONSTRUCT, 'QuestionConstruct', 'controlconstruct', ['name', ['questionItem', 'name']],
     '&constructkind=QUESTION_CONSTRUCT'),
  new QddtElement(ElementKind.SEQUENCE_CONSTRUCT, 'Sequence', 'controlconstruct', ['name'],
     '&constructkind=SEQUENCE_CONSTRUCT'),
  new QddtElement(ElementKind.STATEMENT_CONSTRUCT, 'Statement', 'controlconstruct', ['statment', 'name'],
     '&constructkind=STATEMENT_CONSTRUCT'),
  new QddtElement(ElementKind.INSTRUMENT, 'Instrument', 'instrument', ['label', 'description'], null),
  new QddtElement(ElementKind.PUBLICATION, 'Publication', 'publication', ['name', 'purpose'], null),
  new QddtElement(ElementKind.QUESTION_GRID, 'QuestionGrid', 'questiongrid', ['name', 'question'], null),
  new QddtElement(ElementKind.QUESTION_ITEM, 'QuestionItem', 'questionitem', ['name', 'question'], null),
  new QddtElement(ElementKind.RESPONSEDOMAIN, 'ResponseDomain', 'responsedomain', ['name', 'description'], null),
  new QddtElement(ElementKind.STUDY, 'Study', 'study', ['name', 'description'], null),
  new QddtElement(ElementKind.SURVEY_PROGRAM, 'Survey', 'surveyprogram', ['name', 'description'], null),
  new QddtElement(ElementKind.TOPIC_GROUP, 'Module', 'topicgroup', ['name', 'abstractDescription'], null),
  new QddtElement(ElementKind.INSTRUCTION, 'Instruction', 'instruction', ['description'], null),
  new QddtElement(ElementKind.UNIVERSE, 'Universe', 'universe', ['description'], null),
];
