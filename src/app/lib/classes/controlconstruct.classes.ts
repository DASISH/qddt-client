import { IComment, IEntityEditAudit, IOtherMaterial, IUser, IVersion } from '../interfaces';
import { ElementKind } from '../enums';
import { Parameter, Agency, InstrumentSequence, QuestionItem, ElementRevisionRefImpl } from '.';
import { isString } from '../consts/functions';

export enum SequenceKind {
  NA,
  QUESTIONNAIRE,
  SECTION,
  BATTERY,
  // UNIVERSE
}


export enum ConditionKind {
  ComputationItem = 'COMPUTATION_ITEM',
  IfThenElse = 'IF_THEN_ELSE',
  Loop = 'LOOP',
  RepeatUntil = 'REPEAT_UNTIL',
  RepeatWhile = 'REPEAT_WHILE'
}


export enum ConstructReferenceKind {
  NONE = 'NONE',
  ASSIGN_LATER = 'ASSIGN_LATER',
  NEXT_IN_LINE = 'NEXT_IN_LINE',
  EXIT_SEQUENCE = 'EXIT_SEQUENCE',
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


export abstract class AbstractControlConstruct implements IEntityEditAudit {
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
  comments?: IComment[];
  id: string;
  name: string;
  classKind: string;
  xmlLang?: string;
  inParameter?: Parameter[];
  outParameter?: Parameter[];
  abstract get parameters(): Parameter[];
}


export class QuestionConstruct implements AbstractControlConstruct {
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
  get parameters() { return this.outParameter; }

  public constructor(init?: Partial<QuestionConstruct>) {
    Object.assign(this, init);
  }

}


export class SequenceConstruct implements AbstractControlConstruct {
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
  sequence: ElementRevisionRefImpl<AbstractControlConstruct>[] = [];
  get parameters(): Parameter[] {
    return [].concat(...this.sequence.map(seq => (seq.element) ? seq.element.parameters : []));
  }
  public constructor(init?: Partial<SequenceConstruct>) {
    Object.assign(this, init);
  }
}


export class StatementConstruct implements AbstractControlConstruct {
  id: string;
  name: string;
  statement: string;
  inParameter?: Parameter[] = [];
  outParameter?: Parameter[];
  xmlLang?: string;
  classKind = ElementKind[ElementKind.STATEMENT_CONSTRUCT];
  get parameters() { return this.outParameter; }

  public constructor(init?: Partial<StatementConstruct>) {
    Object.assign(this, init);
  }

}


export class ConditionConstruct implements AbstractControlConstruct {
  id: string;
  name: string;
  conditionKind: string;
  condition: IfThenElse | Loop | RepeatWhile | RepeatUntil;
  inParameter?: Parameter[] = [];
  outParameter?: Parameter[] = [];
  classKind = ElementKind[ElementKind.CONDITION_CONSTRUCT];
  xmlLang?: string;
  get parameters() { return this.outParameter; }

  public constructor(init?: Partial<ConditionConstruct>) {
    Object.assign(this, init);

    if (init) {
      switch (init.conditionKind) {
        case ConditionKind.ComputationItem:
          break;
        case ConditionKind.IfThenElse:
          this.condition = new IfThenElse(JSON.parse(this.condition.toString()));
          break;
        case ConditionKind.Loop:
          this.condition = new Loop(JSON.parse(this.condition.toString()));
          break;
        case ConditionKind.RepeatUntil:
          this.condition = new RepeatUntil(JSON.parse(this.condition.toString()));
          break;
        case ConditionKind.RepeatWhile:
          this.condition = new RepeatWhile(JSON.parse(this.condition.toString()));
          break;
      }
      // }
    }
  }
}


export class Condition {
  programmingLanguage?: 'JavaScript'; content = '';
  public constructor(init?: Partial<Condition>) {
    Object.assign(this, init);
  }
}


export abstract class ConRef {
  abstract get condition(): Condition;
  abstract get ref(): InstrumentSequence | ConstructReferenceKind;
}


export class IfThenElse implements ConRef {
  ifCondition: Condition = new Condition();
  thenConstructReference: InstrumentSequence | ConstructReferenceKind = ConstructReferenceKind.NEXT_IN_LINE;
  elseIf?: Condition = new Condition();
  elseConstructReference?: InstrumentSequence | ConstructReferenceKind = ConstructReferenceKind.NONE;
  public constructor(init?: Partial<IfThenElse>) {
    Object.assign(this, init);
  }
  get condition(): Condition {
    return this.ifCondition;
  }
  get ref(): InstrumentSequence | ConstructReferenceKind {
    return this.thenConstructReference;
  }
}


export class Loop implements ConRef {
  loopWhile: Condition = new Condition({ content: '' });
  controlConstructReference: InstrumentSequence | ConstructReferenceKind = ConstructReferenceKind.NEXT_IN_LINE;
  loopVariableReference?: InstrumentSequence | ConstructReferenceKind;
  initialValue?: number;
  stepValue?: number;
  public constructor(init?: Partial<Loop>) {
    Object.assign(this, init);
  }
  get condition(): Condition {
    return this.loopWhile;
  }
  get ref(): InstrumentSequence | ConstructReferenceKind {
    return this.controlConstructReference;
  }
}


export class RepeatWhile implements ConRef {
  whileCondition: Condition = new Condition();
  whileConstructReference: InstrumentSequence | ConstructReferenceKind = ConstructReferenceKind.NEXT_IN_LINE;
  public constructor(init?: Partial<RepeatWhile>) {
    Object.assign(this, init);
  }
  get condition(): Condition {
    return this.whileCondition;
  }
  get ref(): InstrumentSequence | ConstructReferenceKind {
    return this.whileConstructReference;
  }
}


export class RepeatUntil implements ConRef {
  untilCondition: Condition = new Condition();;
  untilConstructReference: InstrumentSequence | ConstructReferenceKind = ConstructReferenceKind.NEXT_IN_LINE;
  public constructor(init?: Partial<RepeatUntil>) {
    Object.assign(this, init);
  }
  get condition(): Condition {
    return this.untilCondition;
  }
  get ref(): InstrumentSequence | ConstructReferenceKind {
    return this.untilConstructReference;
  }
}


export const isConRef = (element: any | ConRef): element is ConRef => {
  return (element) && (element as ConRef).condition !== undefined;
}

export const isCondition = (element: any | Condition): element is Condition => {
  return (element) && (element as Condition).content !== undefined;
}

// export const asConditionKind = (value: ConditionKind | any): value is ConditionKind => {
//   return (value as ConditionKind) !== undefined;
// }


// export const isConditionKind = (maybeFruit: string): maybeFruit is keyof typeof ConditionKind => {
//   return Object.values(ConditionKind).indexOf(maybeFruit) !== -1;
// }

export const isAbstractControlConstruct = (element: any | AbstractControlConstruct): element is AbstractControlConstruct => {
  return (element) && (element as AbstractControlConstruct).outParameter !== undefined;
}
