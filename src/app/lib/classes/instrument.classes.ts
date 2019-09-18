import {IEntityAudit} from '../interfaces';
import {Study} from './home.classes';
import {ElementKind} from '../enums';
import {ElementRevisionRef} from './element-revision-ref';


export enum InstrumentKind {
  QUESTIONNAIRE = 1,
  QUESTIONNAIRE_STRUCTURED,
  QUESTIONNAIRE_SEMISTRUCTURED,
  QUESTIONNAIRE_UNSTRUCTURED,
  INTERVIEW_SCHEME_AND_THEMES,
  DATA_COLLECTION_GUIDELINES,
  DATACOLLECTIONGUIDELINES_OBSERVATIONGUIDE,
  DATACOLLECTIONGUIDELINES_DISCUSSIONGUIDE,
  DATACOLLECTIONGUIDELINES_SELFADMINISTEREDWRITINGSGUIDE,
  DATACOLLECTIONGUIDELINES_SECONDARYDATACOLLECTIONGUIDE,
  PARTICIPANT_TASKS,
  TECHNICAL_INSTRUMENTS,
  PROGRAMMING_SCRIPT,
  OTHER
}

export const INSTRUMENT_KIND = [
  {id: InstrumentKind.QUESTIONNAIRE, label: 'Questionnaire' },
  {id: InstrumentKind.QUESTIONNAIRE_STRUCTURED, label: 'Questionnaire Structured' },
  {id: InstrumentKind.QUESTIONNAIRE_SEMISTRUCTURED, label: 'Questionnaire SemiStructured' },
  {id: InstrumentKind.QUESTIONNAIRE_UNSTRUCTURED, label: 'Questionnaire Unstructured' },
  {id: InstrumentKind.INTERVIEW_SCHEME_AND_THEMES, label: 'InterviewSchemeAndThemes' },
  {id: InstrumentKind.DATA_COLLECTION_GUIDELINES, label: 'DataCollectionGuidelines' },
  {id: InstrumentKind.DATACOLLECTIONGUIDELINES_OBSERVATIONGUIDE, label: 'DataCollectionGuidelines ObservationGuide' },
  {id: InstrumentKind.DATACOLLECTIONGUIDELINES_DISCUSSIONGUIDE, label: 'DataCollectionGuidelines DiscussionGuide' },
  {id: InstrumentKind.DATACOLLECTIONGUIDELINES_SELFADMINISTEREDWRITINGSGUIDE,
    label: 'DataCollectionGuidelines SelfAdministeredWritingsGuide' },
  {id: InstrumentKind.DATACOLLECTIONGUIDELINES_SECONDARYDATACOLLECTIONGUIDE,
    label: 'DataCollectionGuidelines SecondaryDataCollectionGuide' },
  {id: InstrumentKind.PARTICIPANT_TASKS, label: 'ParticipantTasks' },
  {id: InstrumentKind.TECHNICAL_INSTRUMENTS, label: 'TechnicalInstruments' },
  {id: InstrumentKind.PROGRAMMING_SCRIPT, label: 'ProgrammingScript' },
  {id: InstrumentKind.OTHER, label: 'Other' },
  ];

export class Instrument implements IEntityAudit {
  id: string;
  label: string;
  name: string;
  description: string;
  instrumentKind = InstrumentKind[InstrumentKind.QUESTIONNAIRE];
  sequence: InstrumentSequence[];
  study?: Study;
  comments: any[];
  classKind = ElementKind[ElementKind.INSTRUMENT];
  public constructor(init?: Partial<Instrument>) {
    Object.assign(this, init);
  }
}

export class InstrumentSequence {
  id: string;
  elementRef: ElementRevisionRef;
  parameters: Parameter[] = [];
  sequence: InstrumentSequence[] = [];
}

export class Parameter {
  referenceId: string;
  name: string;
}
