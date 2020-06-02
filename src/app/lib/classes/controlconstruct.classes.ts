import { IComment, IEntityAudit, IEntityEditAudit, IElementRef, IOtherMaterial, IUser, IVersion } from '../interfaces';
import { ElementKind } from '../enums';
import { Agency, InstrumentSequence, ElementRevisionRef, QuestionItem, ElementRevisionRefImpl } from '.';
import { Parameter } from './instrument.classes';

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


export class QuestionConstruct implements IEntityEditAudit {
  id: string;
  name: string;
  description: string;
  classKind = ElementKind[ElementKind.QUESTION_CONSTRUCT];
  questionItemRef: ElementRevisionRefImpl<QuestionItem>;
  otherMaterials: IOtherMaterial[] = [];
  universe: Universe[] = [];
  preInstructions: Instruction[] = [];
  postInstructions: Instruction[] = [];
  inParameter?: string[] = [];
  outParameter?: Parameter[] = [];
  xmlLang?: string;
  public constructor(init?: Partial<QuestionConstruct>) {
    Object.assign(this, init);
  }

}

export class SequenceConstruct implements IEntityEditAudit {
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
  inParameter?: string[] = [];
  outParameter?: Parameter[] = [];
  xmlLang?: string;
  comments?: IComment[];
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
  inParameter?: string[] = [];
  xmlLang?: string;
  classKind = ElementKind[ElementKind.STATEMENT_CONSTRUCT];
  public constructor(init?: Partial<StatementConstruct>) {
    Object.assign(this, init);
  }

}


export enum ConditionKind {
  ComputationItem = 'COMPUTATION_ITEM',
  IfThenElse = 'IF_THEN_ELSE',
  ForI = 'LOOP',
  ForEach = 'LOOP_E',
  RepeatUntil = 'REPEAT_UNTIL',
  RepeatWhile = 'REPEAT_WHILE'
}

export enum ConstructReferenceKind {
  EXIT,
  EXIT_SEQUENCE,
  NEXT,
  SKIPNEXT
}
export class ConditionConstruct implements IEntityEditAudit {
  id: string;
  name: string;
  conditionKind: string;
  condition: string | IfThenElse | Loop | RepeatWhile | RepeatUntil;
  classKind = ElementKind[ElementKind.CONDITION_CONSTRUCT];
  xmlLang?: string;

  public constructor(init?: Partial<ConditionConstruct>) {
    Object.assign(this, init);
    if (init && init.condition && typeof init.condition === 'string') {
      switch (ConditionKind[init.conditionKind]) {
        case ConditionKind.ComputationItem:
          break;
        case ConditionKind.IfThenElse:
          this.condition = new IfThenElse(JSON.parse(init.condition));
          break;
        case ConditionKind.ForEach:
          this.condition = new Loop(JSON.parse(init.condition));
          break;
        case ConditionKind.ForI:
          this.condition = new Loop(JSON.parse(init.condition));
          break;
        case ConditionKind.RepeatUntil:
          this.condition = new RepeatUntil(JSON.parse(init.condition));
          break;
        case ConditionKind.RepeatWhile:
          this.condition = new RepeatWhile(JSON.parse(init.condition));
          break;
      }
    }
  }
}

interface Condition { programmingLanguage?: string; content: string; }


export class IfThenElse {
  ifCondition: Condition;
  thenConstructReference: InstrumentSequence | ConstructReferenceKind;
  elseIf?: Condition;
  elseConstructReference?: InstrumentSequence | ConstructReferenceKind;
  public constructor(init?: Partial<IfThenElse>) {
    Object.assign(this, init);
  }
}

export class Loop {
  loopVariableReference?: InstrumentSequence | ConstructReferenceKind;
  initialValue?: number;
  loopWhile: Condition;
  stepValue?: number;
  controlConstructReference: InstrumentSequence | ConstructReferenceKind;
  public constructor(init?: Partial<Loop>) {
    Object.assign(this, init);
  }
}

export class RepeatWhile {
  whileCondition: Condition;
  whileConstructReference: InstrumentSequence | ConstructReferenceKind;
  public constructor(init?: Partial<RepeatWhile>) {
    Object.assign(this, init);
  }
}

export class RepeatUntil {
  untilCondition: Condition;
  untilConstructReference: InstrumentSequence | ConstructReferenceKind;
  public constructor(init?: Partial<RepeatUntil>) {
    Object.assign(this, init);
  }
}
