import { IComment, IEntityEditAudit, IOtherMaterial, IUser, IVersion } from '../interfaces';
import { ElementKind } from '../enums';
import { Parameter, Agency, InstrumentSequence, ElementRevisionRef, QuestionItem, ElementRevisionRefImpl } from '.';

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
  xmlLang?: string;
  public constructor(init?: Partial<Universe>) {
    Object.assign(this, init);
    if (this.description && (!this.name || this.name.length === 0)) {
      this.name = this.description.substr(0, 20).toUpperCase();
    }
  }
}

export class Instruction implements IEntityEditAudit {
  id: string;
  name: string;
  description: string;
  classKind = ElementKind[ElementKind.INSTRUCTION];
  xmlLang?: string;
  public constructor(init?: Partial<Instruction>) {
    Object.assign(this, init);
    /// TODO remove this code and on line 21, implement in backend.
    if (this.description && (!this.name || this.name.length === 0)) {
      this.name = this.description.substr(0, 20).toUpperCase();
    }
  }
}


export class QuestionConstruct implements IControlConstruct {
  id: string;
  name: string;
  description: string;
  classKind = ElementKind[ElementKind.QUESTION_CONSTRUCT];
  questionItemRef: ElementRevisionRefImpl<QuestionItem>;
  otherMaterials: IOtherMaterial[] = [];
  universe: Universe[] = [];
  preInstructions: Instruction[] = [];
  postInstructions: Instruction[] = [];
  inParameter?: Parameter[] = [];
  outParameter?: Parameter[] = [];
  xmlLang?: string;
  public constructor(init?: Partial<QuestionConstruct>) {
    Object.assign(this, init);
  }

}

export class SequenceConstruct implements IControlConstruct {
  id: string;
  name: string;
  label?: string;
  description?: string;
  basedOnObject?: string;
  basedOnRevision?: number;
  changeComment?: string;
  changeKind?: string;
  modified?: number;
  modifiedBy?: IUser;
  version?: IVersion;
  agency?: Agency;
  archived?: boolean;
  otherMaterials?: IOtherMaterial[];
  inParameter?: Parameter[] = [];
  outParameter?: Parameter[] = [];
  xmlLang?: string;
  comments?: IComment[];
  classKind = ElementKind[ElementKind.SEQUENCE_CONSTRUCT];
  sequenceKind = SequenceKind[SequenceKind.SECTION];
  sequence: ElementRevisionRefImpl<IControlConstruct>[] = [];
  public constructor(init?: Partial<SequenceConstruct>) {
    Object.assign(this, init);
  }
}

export class StatementConstruct implements IControlConstruct {
  id: string;
  name: string;
  statement: string;
  inParameter?: Parameter[] = [];
  outParameter?: Parameter[];
  xmlLang?: string;
  classKind = ElementKind[ElementKind.STATEMENT_CONSTRUCT];
  public constructor(init?: Partial<StatementConstruct>) {
    Object.assign(this, init);
  }

}

export interface IControlConstruct extends IEntityEditAudit {
  inParameter?: Parameter[];
  outParameter?: Parameter[];
}


// export enum ConditionKind {
//   ComputationItem = 'COMPUTATION_ITEM',
//   IfThenElse = 'IF_THEN_ELSE',
//   ForI = 'LOOP',
//   ForEach = 'LOOP_E',
//   RepeatUntil = 'REPEAT_UNTIL',
//   RepeatWhile = 'REPEAT_WHILE'
// }

export enum ConditionKind {
  COMPUTATION_ITEM,
  IF_THEN_ELSE,
  LOOP,
  LOOP_E,
  REPEAT_UNTIL,
  REPEAT_WHILE
}


export enum ConstructReferenceKind {
  NONE,
  ASSIGN_LATER,
  NEXT_IN_LINE,
  EXIT_SEQUENCE,
}

export class ConditionConstruct implements IControlConstruct {
  id: string;
  name: string;
  conditionKind: string;
  condition: string | IfThenElse | Loop | RepeatWhile | RepeatUntil;
  inParameter?: Parameter[] = [];
  outParameter?: Parameter[] = [];
  classKind = ElementKind[ElementKind.CONDITION_CONSTRUCT];
  xmlLang?: string;
  public constructor(init?: Partial<ConditionConstruct>) {
    Object.assign(this, init);
    if (init && init.condition && typeof init.condition === 'string') {
      switch (ConditionKind[init.conditionKind]) {
        case ConditionKind.COMPUTATION_ITEM:
          break;
        case ConditionKind.IF_THEN_ELSE:
          this.condition = new IfThenElse(JSON.parse(init.condition));
          break;
        case ConditionKind.LOOP_E:
          this.condition = new Loop(JSON.parse(init.condition));
          break;
        case ConditionKind.LOOP:
          this.condition = new Loop(JSON.parse(init.condition));
          break;
        case ConditionKind.REPEAT_UNTIL:
          this.condition = new RepeatUntil(JSON.parse(init.condition));
          break;
        case ConditionKind.REPEAT_WHILE:
          this.condition = new RepeatWhile(JSON.parse(init.condition));
          break;
      }
    }
  }

}

export class Condition { programmingLanguage?: 'JavaScript'; content: string; }


export abstract class ConRef {
  abstract get condition(): Condition;
  abstract get ref(): InstrumentSequence | ElementRevisionRef | ConstructReferenceKind;
}

export class IfThenElse implements ConRef {
  ifCondition: Condition;
  thenConstructReference: InstrumentSequence | ElementRevisionRef | ConstructReferenceKind = ConstructReferenceKind.NEXT_IN_LINE;
  elseIf?: Condition;
  elseConstructReference?: InstrumentSequence | ElementRevisionRef | ConstructReferenceKind = ConstructReferenceKind.NONE;
  public constructor(init?: Partial<IfThenElse>) {
    Object.assign(this, init);
  }
  get condition(): Condition {
    return this.ifCondition;
  }
  get ref(): InstrumentSequence | ElementRevisionRef | ConstructReferenceKind {
    return this.thenConstructReference;
  }
}

export class Loop implements ConRef {
  loopWhile: Condition;
  controlConstructReference: InstrumentSequence | ElementRevisionRef | ConstructReferenceKind = ConstructReferenceKind.NEXT_IN_LINE;
  loopVariableReference?: InstrumentSequence | ElementRevisionRef | ConstructReferenceKind;
  initialValue?: number;
  stepValue?: number;
  public constructor(init?: Partial<Loop>) {
    Object.assign(this, init);
  }
  get condition(): Condition {
    return this.loopWhile;
  }
  get ref(): InstrumentSequence | ElementRevisionRef | ConstructReferenceKind {
    return this.controlConstructReference;
  }
}

export class RepeatWhile implements ConRef {
  whileCondition: Condition;
  whileConstructReference: InstrumentSequence | ElementRevisionRef | ConstructReferenceKind = ConstructReferenceKind.NEXT_IN_LINE;
  public constructor(init?: Partial<RepeatWhile>) {
    Object.assign(this, init);
  }
  get condition(): Condition {
    return this.whileCondition;
  }
  get ref(): InstrumentSequence | ElementRevisionRef | ConstructReferenceKind {
    return this.whileConstructReference;
  }
}

export class RepeatUntil implements ConRef {
  untilCondition: Condition;
  untilConstructReference: InstrumentSequence | ElementRevisionRef | ConstructReferenceKind = ConstructReferenceKind.NEXT_IN_LINE;
  public constructor(init?: Partial<RepeatUntil>) {
    Object.assign(this, init);
  }
  get condition(): Condition {
    return this.untilCondition;
  }
  get ref(): InstrumentSequence | ElementRevisionRef | ConstructReferenceKind {
    return this.untilConstructReference;
  }
}

export const isConRef = (element: any | ConRef): element is ConRef => {
  return (element) && (element as ConRef).condition !== undefined;
}

// export const isConditionConstruct = (element: any | ConditionConstruct): element is ConditionConstruct => {
//   return (element) && (element as ConditionConstruct).condition !== undefined;
// }

