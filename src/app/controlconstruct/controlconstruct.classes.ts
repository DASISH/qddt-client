import { QuestionItem } from '../question/question.classes';
import { IEntityAudit } from '../shared/classes/interfaces';
import { ElementKind } from '../shared/classes/enums';
import { ElementRevisionRef } from '../shared/classes/classes';

export enum SequenceKind {
  NA,
  QUESTIONNAIRE,
  SECTION,
  BATTERY,
  UNIVERSE
}

export class Universe implements IEntityAudit {
  id: string;
  name: string;
  description: string;
  classKind = ElementKind[ElementKind.UNIVERSE];
}

export class Instruction implements IEntityAudit {
  id: string;
  name: string;
  description: string;
  classKind = ElementKind[ElementKind.INSTRUCTION];
}

export class ConditionCommand {
  type: ElementKind;
  constructId: string;
  constructName: string;
  command: string;
}


export class QuestionConstruct implements IEntityAudit {
  id: string;
  name: string;
  classKind = ElementKind[ElementKind.QUESTION_CONSTRUCT];
  questionItem: QuestionItem;
  questionItemRevision: number;
  otherMaterials: any;
  universe: Universe[];
  preInstructions: Instruction[];
  postInstructions: Instruction[];
}

export class SequenceConstruct implements IEntityAudit {
  id: string;
  name: string;
  label: string;
  description: string;
  classKind = ElementKind[ElementKind.SEQUENCE_CONSTRUCT];
  sequenceKind = SequenceKind[SequenceKind.SECTION];
  sequence: ElementRevisionRef[];
}

export class StatementConstruct implements IEntityAudit {
  id: string;
  name: string;
  statement: string;
  classKind = ElementKind[ElementKind.STATEMENT_CONSTRUCT];
}

export class ConditionConstruct implements IEntityAudit {
  id: string;
  name: string;
  condition: string;
  classKind = ElementKind[ElementKind.CONDITION_CONSTRUCT];
  ifCondition: ConditionCommand;
  elseConditions: ConditionCommand[];
}
