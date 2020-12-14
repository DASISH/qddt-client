import { IComment, IEntityEditAudit, IOtherMaterial, IUser, IVersion } from '../interfaces';
import { ElementKind } from '../enums';
import { ElementRevisionRefImpl } from './element-revision-ref';
import { QuestionItem } from './questionitem.classes';
import { Agency } from './user.classes';
import { UserResponse } from './responsedomain.classes';

import * as uuid from 'uuid';

export enum SequenceKind {
  NA,
  QUESTIONNAIRE,
  SECTION,
  BATTERY,
  LOOP,
  // UNIVERSE
}

export enum ParameterKind {
  IN,
  OUT
}

export enum ConditionKind {
  ComputationItem = 'COMPUTATION_ITEM',
  IfThenElse = 'IF_THEN_ELSE',
  Loop = 'LOOP',
  RepeatUntil = 'REPEAT_UNTIL',
  RepeatWhile = 'REPEAT_WHILE'
}


export enum ConstructReferenceKind {
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


export class Parameter {
  id: string;
  idx?: number;
  name: string;
  referencedId?: string;
  parameterKind: ParameterKind;
  value: UserResponse[] = [];
  public constructor(init?: Partial<Parameter>) {
    Object.assign(this, init);
    if (!init.id) {
      this.id = uuid.v4();

    }
  }
  equals(arg0: Parameter) {
    if (this.id !== arg0.id)
      return false;
    if (this.value.length !== arg0.value.length)
      return false;

    for (let i = 0, l = this.value.length; i < l; i++) {
      if (this.value[i] !== arg0.value[i]) {
        return false;
      }
    }
    return true;
  }
}

export class ConstructInstruction {
  instruction: Instruction;
  instructionRank: string;
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
  label?: string;
  description?: string;
  classKind: string;
  xmlLang?: string;
  parameterIn?: Parameter[];
  parameterOut?: Parameter[];
  abstract get parameters(): Parameter[];
}

export class QuestionConstruct implements AbstractControlConstruct {
  id: string;
  name: string;
  label?: string;
  description?: string;
  classKind = ElementKind[ElementKind.QUESTION_CONSTRUCT];
  questionItemRef: ElementRevisionRefImpl<QuestionItem>;
  otherMaterials: IOtherMaterial[] = [];
  universe: Universe[] = [];
  controlConstructInstructions: ConstructInstruction[] = [];
  parameterIn?: Parameter[] = [];
  parameterOut?: Parameter[] = [];
  xmlLang?: string;
  get parameters() { return this.parameterOut; }
  get preInstructions() { return this.controlConstructInstructions.filter(f => f.instructionRank === 'PRE').map(p => p.instruction); }
  get postInstructions() { return this.controlConstructInstructions.filter(f => f.instructionRank === 'POST').map(p => p.instruction); }

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
  universe: Universe[] = [];
  parameterIn?: Parameter[] = [];
  parameterOut?: Parameter[] = [];
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
  parameterIn?: Parameter[] = [];
  parameterOut?: Parameter[];

  xmlLang?: string;
  classKind = ElementKind[ElementKind.STATEMENT_CONSTRUCT];
  get parameters() { return []; }

  public constructor(init?: Partial<StatementConstruct>) {
    Object.assign(this, init);
  }

}

//  ConditionConstruct.Condition helper classes --- BEGIN

export class Condition {
  programmingLanguage = 'JavaScript';
  content = '';
  public constructor(init?: Partial<Condition>) {
    Object.assign(this, init);
  }
}


export abstract class ConRef {
  abstract get condition(): Condition;
  abstract get ref(): ConstructReferenceKind;
}


export class Loop implements ConRef {
  controlConstructReference: ConstructReferenceKind = ConstructReferenceKind.NEXT_IN_LINE;
  loopVariableReference = new Parameter({ name: 'INPUT1', parameterKind: ParameterKind.IN });
  loopWhile?: Condition;
  initialValue?: number;
  stepValue?: number;
  public constructor(init?: Partial<Loop>) {
    Object.assign(this, init);
  }
  get condition(): Condition {
    return this.loopWhile;
  }
  get ref(): ConstructReferenceKind {
    return this.controlConstructReference;
  }
}


export class RepeatWhile implements ConRef {
  whileCondition: Condition = new Condition();
  whileConstructReference: ConstructReferenceKind = ConstructReferenceKind.NEXT_IN_LINE;
  public constructor(init?: Partial<RepeatWhile>) {
    Object.assign(this, init);
  }
  get condition(): Condition {
    return this.whileCondition;
  }
  get ref(): ConstructReferenceKind {
    return this.whileConstructReference;
  }
}


export class RepeatUntil implements ConRef {
  untilCondition: Condition = new Condition();
  untilConstructReference: ConstructReferenceKind = ConstructReferenceKind.NEXT_IN_LINE;
  public constructor(init?: Partial<RepeatUntil>) {
    Object.assign(this, init);
  }
  get condition(): Condition {
    return this.untilCondition;
  }
  get ref(): ConstructReferenceKind {
    return this.untilConstructReference;
  }
}



export interface IIfThenElse {
  ifCondition: Condition;
  thenConstructReference: ConstructReferenceKind;
}


export class IfThenElse implements ConRef, IIfThenElse {
  ifCondition: Condition = new Condition();
  thenConstructReference: ConstructReferenceKind = ConstructReferenceKind.NEXT_IN_LINE;
  elseIf: IIfThenElse[] = [];
  public constructor(init?: Partial<IfThenElse>) {
    Object.assign(this, init);
    if (!this.elseIf.length) {
      this.elseIf = [];
    }
  }
  get condition(): Condition {
    return this.ifCondition;
  }
  get ref(): ConstructReferenceKind {
    return this.thenConstructReference;
  }
}

export interface ICondition {
  id: string;
  name: string;
  conditionKind: string;
  classKind: string;
  condition: IfThenElse | Loop | RepeatWhile | RepeatUntil | any;
  parameterIn?: Parameter[];
  parameterOut?: Parameter[];
  sequence: ElementRevisionRefImpl<AbstractControlConstruct>[];
}
// ConditionConstruct.Condition helper classes --- END


export class ConditionConstruct implements AbstractControlConstruct, ICondition {
  id: string;
  name: string;
  label?: string;
  description?: string;
  conditionKind: string;
  condition: IfThenElse | Loop | RepeatWhile | RepeatUntil | any;
  parameterIn?: Parameter[] = [];
  parameterOut?: Parameter[] = [];
  sequence: ElementRevisionRefImpl<AbstractControlConstruct>[] = [];
  classKind = ElementKind[ElementKind.CONDITION_CONSTRUCT];
  xmlLang?: string;
  get parameters() { return this.parameterOut; }

  public constructor(init?: Partial<ConditionConstruct>) {
    Object.assign(this, init);
    // if (isAbstractControlConstruct(init)){

    // } else {

    // }
    if (init && isString(init.condition)) {

      switch (init.conditionKind) {
        case ConditionKind.ComputationItem:
          break;
        case ConditionKind.IfThenElse:
          this.condition = new IfThenElse(JSON.parse(init.condition));
          break;
        case ConditionKind.Loop:
          this.condition = new Loop(JSON.parse(init.condition));

          if (!this.parameterIn.find(f => f.name === this.condition.loopVariableReference.name)) {
            this.parameterIn.push(this.condition.loopVariableReference);
          }
          break;
        case ConditionKind.RepeatUntil:
          this.condition = new RepeatUntil(JSON.parse(init.condition));
          break;
        case ConditionKind.RepeatWhile:
          this.condition = new RepeatWhile(JSON.parse(init.condition));
          break;
        default:
          this.conditionKind = ConditionKind.IfThenElse;
          this.condition = new IfThenElse();
      }
    }
    if (!this.conditionKind) {
      this.conditionKind = ConditionKind.IfThenElse;
      this.condition = new IfThenElse();
    }
  }
}


export const isConRef = (element: any | ConRef): element is ConRef => {
  return (element) && (element as ConRef).condition !== undefined;
}

export const isCondition = (element: any | Condition): element is Condition => {
  return (element) && (element as Condition).content !== undefined;
}

export const isSequence = (element?: any | SequenceConstruct): element is SequenceConstruct =>
  (element) && (element as SequenceConstruct).sequence !== undefined;


export const isAbstractControlConstruct = (element: any | AbstractControlConstruct): element is AbstractControlConstruct => {
  return (element) && (element as AbstractControlConstruct).parameterOut !== undefined;
}


const isString = (value: string | any): value is string => {
  return (typeof value === 'string') ? (value as string) !== undefined : false;
}
