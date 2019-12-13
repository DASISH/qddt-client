import {IComment, IEntityAudit, IEntityEditAudit, IElementRef, IOtherMaterial, IUser, IVersion} from '../interfaces';
import { ElementKind } from '../enums';
import { ElementRevisionRef } from './element-revision-ref';
import { QuestionItem } from './questionitem.classes';

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
  questionItem: QuestionItem;
  questionItemRevision: number;
  otherMaterials: IOtherMaterial[] = [];
  universe: Universe[] = [];
  preInstructions: Instruction[] = [];
  postInstructions: Instruction[] = [];
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
  agency?: IEntityAudit;
  archived?: boolean;
  otherMaterials?: IOtherMaterial[];
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
  xmlLang?: string;
  classKind = ElementKind[ElementKind.STATEMENT_CONSTRUCT];
  public constructor(init?: Partial<StatementConstruct>) {
    Object.assign(this, init);
  }

}

export enum ConditionKind {
  COMPUTATION_ITEM, IF_THEN_ELSE, LOOP, REPEAT_UNTIL, REPEAT_WHILE
}

export class ConditionConstruct implements IEntityEditAudit {
  id: string;
  name: string;
  conditionKind: string;
  condition: string | IfThenElse | Loop | RepeatWhile | RepeatUntil;
  classKind = ElementKind[ElementKind.CONDITION_CONSTRUCT];

  public constructor(init?: Partial<ConditionConstruct>) {
    Object.assign(this, init);
    if (init && init.condition && typeof init.condition === 'string') {
      switch (ConditionKind[init.conditionKind]) {
        case ConditionKind.COMPUTATION_ITEM:
          break;
        case ConditionKind.IF_THEN_ELSE:
          this.condition = new IfThenElse(JSON.parse(init.condition));
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

interface Condition { programmingLanguage: string; content: string; }


export class IfThenElse {
  IfCondition: Condition;
  ThenConstructReference: IElementRef;
  ElseIf?: Condition;
  ElseConstructReference?: IElementRef;
  public constructor(init?: Partial<IfThenElse>) {
    Object.assign(this, init);
  }
}

export class Loop {
  LoopVariableReference?: IElementRef;
  InitialValue?: number;
  LoopWhile: Condition;
  StepValue?: number;
  ControlConstructReference: IElementRef;
  public constructor(init?: Partial<Loop>) {
    Object.assign(this, init);
  }
}

export class RepeatWhile {
  WhileCondition: Condition;
  WhileConstructReference: IElementRef;
  public constructor(init?: Partial<RepeatWhile>) {
    Object.assign(this, init);
  }
}

export class RepeatUntil {
  UntilCondition: Condition;
  UntilConstructReference: IElementRef;
  public constructor(init?: Partial<RepeatUntil>) {
    Object.assign(this, init);
  }
}
