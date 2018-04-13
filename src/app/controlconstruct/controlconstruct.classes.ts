import { QuestionItem } from '../question/question.classes';
import {IEntityAudit, IEntityEditAudit} from '../shared/classes/interfaces';
import { ElementKind } from '../shared/classes/enums';
import { ElementRevisionRef } from '../shared/classes/classes';
import {Concept} from '../home/home.classes';

export enum SequenceKind {
  NA,
  QUESTIONNAIRE,
  SECTION,
  BATTERY,
  UNIVERSE
}

export class Universe implements IEntityAudit {
  id: string;
  name = '';
  description = '';
  classKind = ElementKind[ElementKind.UNIVERSE];
  public constructor(init?: Partial<Universe>) {
    Object.assign(this, init);
  }

}

export class Instruction implements IEntityAudit {
  id: string;
  name: string;
  description: string;
  classKind = ElementKind[ElementKind.INSTRUCTION];
  public constructor(init?: Partial<Instruction>) {
    Object.assign(this, init);
  }

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
  public constructor(init?: Partial<QuestionConstruct>) {
    Object.assign(this, init);
  }

}

export class SequenceConstruct implements IEntityAudit {
  id: string;
  name: string;
  label?: string;
  description?: string;
  classKind = ElementKind[ElementKind.SEQUENCE_CONSTRUCT];
  sequenceKind = SequenceKind[SequenceKind.SECTION];
  sequence: ElementRevisionRef[];
  public constructor(init?: Partial<SequenceConstruct>) {
    Object.assign(this, init);
  }
}

export class StatementConstruct implements IEntityAudit {
  id: string;
  name: string;
  statement: string;
  classKind = ElementKind[ElementKind.STATEMENT_CONSTRUCT];
  public constructor(init?: Partial<StatementConstruct>) {
    Object.assign(this, init);
  }

}

export class ConditionConstruct implements IEntityAudit {
  id: string;
  name: string;
  condition: string;
  classKind = ElementKind[ElementKind.CONDITION_CONSTRUCT];
  ifCondition: ConditionCommand;
  elseConditions: ConditionCommand[];
  public constructor(init?: Partial<ConditionConstruct>) {
    Object.assign(this, init);
  }

}
