export enum ActionKind {
  None,
  Filter,
  Read,
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
  USER
}

export interface EnumItem<E> { id: E; name: keyof E; }

export const StringIsNumber = value => isNaN(Number(value)) === false;

export function enumToArray<E>(Enum: { keyof E: E}): EnumItem<E> {
  return Object.keys(Enum)
    .filter(StringIsNumber)
    .map(key =>
      ({id: +key, name: Enum[key]} as EnumItem<E>));
}

// export function enumToArrayValue<E>(Enum: {keyof E: E}) {
//   return Object.keys(Enum)
//     .filer(!StringIsNumber)
//     .map(key =>
//       ({id: Enum[key], name: key} as EnumItem<E>));
// }
