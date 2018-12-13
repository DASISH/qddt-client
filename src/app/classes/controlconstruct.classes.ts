import { QuestionItem } from '../modules/question/question.classes';
import { IEntityEditAudit, IIdRef, IOtherMaterial} from './interfaces';
import {ElementKind} from './enums';
import {ElementRevisionRef} from './classes';

export enum SequenceKind {
  NA,
  QUESTIONNAIRE,
  SECTION,
  BATTERY,
  // UNIVERSE
}

export class Universe implements IEntityEditAudit {
  id: string;
  name = '';
  description = '';
  classKind = ElementKind[ElementKind.UNIVERSE];

  public constructor(init?: Partial<Universe>) {
    Object.assign(this, init);
    if (this.description && ( !this.name || this.name.length === 0)) {
      this.name = this.description.substr(0, 20).toUpperCase();
    }
  }
}

export class Instruction implements IEntityEditAudit {
  id: string;
  name: string;
  description: string;
  classKind = ElementKind[ElementKind.INSTRUCTION];

  public constructor(init?: Partial<Instruction>) {
    Object.assign(this, init);
    if (this.description && ( !this.name || this.name.length === 0)) {
      this.name = this.description.substr(0, 20).toUpperCase();
    }
  }
}


export class QuestionConstruct implements IEntityEditAudit {
  id: string;
  name: string;
  description: string;
  classKind = ElementKind[ElementKind.QUESTION_CONSTRUCT];
  questionItem: QuestionItem;
  questionItemRevision: number;
  otherMaterials: IOtherMaterial[] = [];
  universe: Universe[] = [];
  preInstructions: Instruction[] = [];
  postInstructions: Instruction[] = [];
  public constructor(init?: Partial<QuestionConstruct>) {
    Object.assign(this, init);
  }

}

export class SequenceConstruct implements IEntityEditAudit {
  id: string;
  name: string;
  label?: string;
  description?: string;
  classKind = ElementKind[ElementKind.SEQUENCE_CONSTRUCT];
  sequenceKind = SequenceKind[SequenceKind.SECTION];
  sequence: ElementRevisionRef[] = [];
  public constructor(init?: Partial<SequenceConstruct>) {
    Object.assign(this, init);
  }
}

export class StatementConstruct implements IEntityEditAudit {
  id: string;
  name: string;
  statement: string;
  classKind = ElementKind[ElementKind.STATEMENT_CONSTRUCT];
  public constructor(init?: Partial<StatementConstruct>) {
    Object.assign(this, init);
  }

}

enum ConditionKind {
  COMPUTATION_ITEM, IF_THEN_ELSE, LOOP, REPEAT_UNTIL, REPEAT_WHILE
}

export class ConditionConstruct implements IEntityEditAudit {
  id: string;
  name: string;
  conditionKind: ConditionKind;
  condition: string;
  classKind = ElementKind[ElementKind.CONDITION_CONSTRUCT];

  get conditionT(): IfThenElse | Loop | RepeatWhile | RepeatUntil {
      switch (this.conditionKind) {
        case ConditionKind.COMPUTATION_ITEM:
        case ConditionKind.IF_THEN_ELSE:
          return new IfThenElse(JSON.parse(this.condition));
        case ConditionKind.LOOP:
          return new Loop(JSON.parse(this.condition));
        case ConditionKind.REPEAT_UNTIL:
          return  new RepeatUntil(JSON.parse(this.condition));
        case ConditionKind.REPEAT_WHILE:
          return new RepeatWhile(JSON.parse(this.condition));
      }
  }

  public constructor(init?: Partial<ConditionConstruct>) {
    Object.assign(this, init);
  }
}

interface Condition { programmingLanguage: string; content: string; }


export class IfThenElse {
  IfCondition:  Condition;
  ThenConstructReference: IIdRef;
  ElseIf?: Condition;
  ElseConstructReference?: IIdRef;
  public constructor(init?: Partial<IfThenElse>) {
    Object.assign(this, init);
  }
}

export class Loop {
  LoopVariableReference?: IIdRef;
  InitialValue?: number;
  LoopWhile: Condition;
  StepValue?: number;
  ControlConstructReference: IIdRef;
  public constructor(init?: Partial<Loop>) {
    Object.assign(this, init);
  }
}

export class RepeatWhile {
  WhileCondition: Condition;
  WhileConstructReference: IIdRef;
  public constructor(init?: Partial<RepeatWhile>) {
    Object.assign(this, init);
  }
}

export class RepeatUntil {
  UntilCondition: Condition;
  UntilConstructReference: IIdRef;
  public constructor(init?: Partial<RepeatUntil>) {
    Object.assign(this, init);
  }
}
