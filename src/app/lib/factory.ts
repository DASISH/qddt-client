import { IEntityAudit } from './interfaces';
import { ElementKind } from './enums';
import { getElementKind } from './consts';
import {
  Category, CategoryKind, Concept, ConditionConstruct,
  Instruction, Instrument,
  Publication,
  QuestionConstruct, QuestionItem,
  ResponseDomain,
  SequenceConstruct, StatementConstruct, Study, SurveyProgram,
  Topic,
  Universe, UserJson, ElementRevisionRef, ElementRevisionRefImpl, Author
} from './classes';

export class Factory {

  static createInstance(kind: ElementKind | string): IEntityAudit {
    const elementKind = getElementKind(kind);
    switch (elementKind) {
      case ElementKind.CATEGORY:
        return new Category();
      case ElementKind.MISSING_GROUP:
        return new Category().setKind(CategoryKind.MISSING_GROUP);
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
      case ElementKind.USER:
        return new UserJson();
      case ElementKind.AUTHOR:
        return new Author();
      default: return null;
    }
  }

  static createFromSeed(kind: ElementKind | string, seed: any): IEntityAudit {
    const elementKind = getElementKind(kind);
    switch (elementKind) {
      case ElementKind.CATEGORY:
        return new Category(seed);
      case ElementKind.MISSING_GROUP:
        return new Category(seed).setKind(CategoryKind.MISSING_GROUP);
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
      case ElementKind.USER:
        return new UserJson(seed);
      case ElementKind.AUTHOR:
        return new Author(seed);
      default: return null;
    }
  }

  static create<T>(type: (new () => T)): T {
    return new type();
  }


  static createRef(kind: ElementKind | string, seed: any): ElementRevisionRef {
    const elementKind = getElementKind(kind);
    switch (elementKind) {
      case ElementKind.CONDITION_CONSTRUCT:
        return new ElementRevisionRefImpl<ConditionConstruct>(seed);
      case ElementKind.QUESTION_CONSTRUCT:
        return new ElementRevisionRefImpl<QuestionConstruct>(seed);
      case ElementKind.SEQUENCE_CONSTRUCT:
        return new ElementRevisionRefImpl<SequenceConstruct>(seed);
      case ElementKind.STATEMENT_CONSTRUCT:
        return new ElementRevisionRefImpl<StatementConstruct>(seed);
    }
  }

}
