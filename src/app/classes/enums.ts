export enum ActionKind {
  None,
  Filter,
  Read,
  Export,
  Create,
  Update,
  Delete,
  Ask,
  Tell
}

export enum ElementKind {
  NONE = 0,
  CATEGORY,
  MISSING_GROUP,
  CONCEPT,
  CONTROL_CONSTRUCT,
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
  UNIVERSE,
  USER,
  CHANGE_LOG
}

export interface EnumItem<E> { id: Number; name: keyof E; }

export const StringIsNumber = value => isNaN(Number(value)) === false;
