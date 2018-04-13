import {
  ConditionConstruct,
  Instruction,
  QuestionConstruct,
  SequenceConstruct,
  StatementConstruct, Universe
} from '../../controlconstruct/controlconstruct.classes';
import { Publication } from '../../publication/publication.service';
import { QuestionItem } from '../../question/question.classes';
import { Instrument } from '../../instrument/instrument.classes';
import { ElementKind } from './enums';
import { IEntityAudit } from './interfaces';
import { Category } from '../../category/category.classes';
import { Concept, Study, SurveyProgram, Topic } from '../../home/home.classes';
import { ResponseDomain } from '../../responsedomain/responsedomain.classes';

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

  static createFromSeed(kind: ElementKind, seed: any): IEntityAudit {
    switch (kind) {
      case ElementKind.CATEGORY:
        return new Category(seed);
      case ElementKind.CONCEPT:
        return new Concept(seed);
      case ElementKind.CONDITION_CONSTRUCT:
        return new ConditionConstruct(seed);
      case ElementKind.QUESTION_CONSTRUCT:
        return new QuestionConstruct(seed);
      case ElementKind.SEQUENCE_CONSTRUCT:
        return new SequenceConstruct(seed);
      case ElementKind.STATEMENT_CONSTRUCT:
        return new StatementConstruct(seed);
      case ElementKind.INSTRUMENT:
        return new Instrument(seed);
      case ElementKind.PUBLICATION:
        return new Publication(seed);
      case ElementKind.QUESTION_GRID:
        return null; // TODO implement QuestionGrid
      case ElementKind.QUESTION_ITEM:
        return new QuestionItem(seed);
      case ElementKind.RESPONSEDOMAIN:
        return new ResponseDomain(seed);
      case ElementKind.STUDY:
        return new Study(seed);
      case ElementKind.SURVEY_PROGRAM:
        return new SurveyProgram(seed);
      case ElementKind.TOPIC_GROUP:
        return new Topic(seed);
      case ElementKind.INSTRUCTION:
        return new Instruction(seed);
      case ElementKind.UNIVERSE:
        return new Universe(seed);
      default: return null;
    }
  }
}
