import { QuestionItem } from '../question/question.classes';
import { IEntityAudit } from '../shared/classes/interfaces';
import { ElementKind } from '../shared/classes/enums';
import { Universe, Instruction } from '../controlconstruct/controlconstruct.classes';



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
