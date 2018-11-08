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

/* export function enumToArray<E>(Enum: { keyof E: E}): EnumItem<E>[] {
  return Object.keys(Enum)
    .filter(StringIsNumber)
    .map(key =>
      ({id: key, name: Enum[key]} as EnumItem<E>));
} */


/* export function enumToArray2<E>(e typeof E)} ): EnumItem<E>[] {
  Enum: { keyof E: E}
  console.log(Enum);
  return Object.keys(Enum)
    .filter(StringIsNumber)
    .map(key => ({id: key, name: Enum[key]} as EnumItem<E>));
}
 */

// export function enumToArrayValue<E>(Enum: {keyof E: E}) {
//   return Object.keys(Enum)
//     .filer(!StringIsNumber)
//     .map(key =>
//       ({id: Enum[key], name: key} as EnumItem<E>));
// }
