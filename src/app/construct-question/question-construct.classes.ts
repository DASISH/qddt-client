import { QuestionItem } from '../question/question.classes';
import { IEntityAudit } from '../shared/classes/interfaces';
import { ElementKind } from '../shared/classes/enums';
import { Universe, Instruction } from '../controlconstruct/controlconstruct.classes';
import { IOtherMaterial } from '../shared/classes/interfaces';


export class QuestionConstruct implements IEntityAudit {
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
