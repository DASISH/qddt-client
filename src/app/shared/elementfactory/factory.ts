import { IEntityAudit } from '../elementinterfaces/entityaudit';
import {ElementKind} from '../elementinterfaces/elements';
import {
  ConditionConstruct,
  Instruction,
  QuestionConstruct,
  SequenceConstruct,
  StatementConstruct, Universe
} from '../../controlconstruct/controlconstruct.service';
import { Category } from '../../category/category.service';
import { Concept, Study, SurveyProgram, Topic} from '../../home/home.service';
import { Publication } from '../../publication/publication.service';
import { QuestionItem } from '../../question/question.service';
import { ResponseDomain } from '../../responsedomain/responsedomain.service';
import { Instrument } from '../../instrument/instrument.classes';

// declare var Materialize: any;


export class Factory {

  static createInstance(kind: ElementKind): IEntityAudit {
    switch (kind) {
      case ElementKind.CATEGORY:
        return new Category();
      case ElementKind.CONCEPT:
        return new Concept();
      case ElementKind.CONDITION_CONSTRUCT:
        return new ConditionConstruct();
      case ElementKind.QUESTION_CONSTRUCT:
        return new QuestionConstruct();
      case ElementKind.SEQUENCE_CONSTRUCT:
        return new SequenceConstruct();
      case ElementKind.STATEMENT_CONSTRUCT:
        return new StatementConstruct();
      case ElementKind.INSTRUMENT:
        return new Instrument();
      case ElementKind.PUBLICATION:
        return new Publication();
      case ElementKind.QUESTION_GRID:
        return null; // TODO implement QuestionGrid
      case ElementKind.QUESTION_ITEM:
        return new QuestionItem();
      case ElementKind.RESPONSEDOMAIN:
        return new ResponseDomain();
      case ElementKind.STUDY:
        return new Study();
      case ElementKind.SURVEY_PROGRAM:
        return new SurveyProgram();
      case ElementKind.TOPIC_GROUP:
        return new Topic();
      case ElementKind.INSTRUCTION:
        return new Instruction();
      case ElementKind.UNIVERSE:
        return new Universe();
      default: return null;
    }
  }
}
