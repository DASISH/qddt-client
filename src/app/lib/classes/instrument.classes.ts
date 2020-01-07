import { IEntityAudit } from '../interfaces';
import { Study } from './home.classes';
import { ElementKind } from '../enums';
import { ElementRevisionRef } from './element-revision-ref';
import { SequenceKind } from '.';


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
  { id: InstrumentKind.QUESTIONNAIRE, value: 'QUESTIONNAIRE', label: 'Questionnaire' },
  { id: InstrumentKind.QUESTIONNAIRE_STRUCTURED, value: 'QUESTIONNAIRE_STRUCTURED', label: 'Questionnaire Structured' },
  { id: InstrumentKind.QUESTIONNAIRE_SEMISTRUCTURED, value: 'QUESTIONNAIRE_SEMISTRUCTURED', label: 'Questionnaire SemiStructured' },
  { id: InstrumentKind.QUESTIONNAIRE_UNSTRUCTURED, value: 'QUESTIONNAIRE_UNSTRUCTURED', label: 'Questionnaire Unstructured' },
  { id: InstrumentKind.INTERVIEW_SCHEME_AND_THEMES, value: 'INTERVIEW_SCHEME_AND_THEMES', label: 'InterviewSchemeAndThemes' },
  { id: InstrumentKind.DATA_COLLECTION_GUIDELINES, value: 'DATA_COLLECTION_GUIDELINES', label: 'DataCollectionGuidelines' },
  { id: InstrumentKind.DATACOLLECTIONGUIDELINES_OBSERVATIONGUIDE, value: 'DATACOLLECTIONGUIDELINES_OBSERVATIONGUIDE', label: 'DataCollectionGuidelines ObservationGuide' },
  { id: InstrumentKind.DATACOLLECTIONGUIDELINES_DISCUSSIONGUIDE, value: 'DATACOLLECTIONGUIDELINES_DISCUSSIONGUIDE', label: 'DataCollectionGuidelines DiscussionGuide' },
  { id: InstrumentKind.DATACOLLECTIONGUIDELINES_SELFADMINISTEREDWRITINGSGUIDE, value: 'DATACOLLECTIONGUIDELINES_SELFADMINISTEREDWRITINGSGUIDE', label: 'DataCollectionGuidelines SelfAdministeredWritingsGuide' },
  { id: InstrumentKind.DATACOLLECTIONGUIDELINES_SECONDARYDATACOLLECTIONGUIDE, value: 'DATACOLLECTIONGUIDELINES_SECONDARYDATACOLLECTIONGUIDE', label: 'DataCollectionGuidelines SecondaryDataCollectionGuide' },
  { id: InstrumentKind.PARTICIPANT_TASKS, value: 'PARTICIPANT_TASKS', label: 'ParticipantTasks' },
  { id: InstrumentKind.TECHNICAL_INSTRUMENTS, value: 'TECHNICAL_INSTRUMENTS', label: 'TechnicalInstruments' },
  { id: InstrumentKind.PROGRAMMING_SCRIPT, value: 'PROGRAMMING_SCRIPT', label: 'ProgrammingScript' },
  { id: InstrumentKind.OTHER, value: 'OTHER', label: 'Other' },
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
  xmlLang?: string;
  classKind = ElementKind[ElementKind.INSTRUMENT];
  get parameters(): Map<string, Parameter> {
    return new Map(
      this.sequence
        .map(s => [...s.parameters])
        .reduce((acc, it) => [...acc, ...it]));
  }

  public constructor(init?: Partial<Instrument>) {
    Object.assign(this, init);
  }
}

export class InstrumentSequence {
  id: string;
  elementRef: ElementRevisionRef;
  get parameters(): Map<string, Parameter> {
    const children = this.sequence
      .map(s => [...s.parameters])
      .reduce((acc, it) => [...acc, ...it]);
    return new Map([[this.id, new Parameter({ name: this.elementRef.name })], ...children]);
  }
  sequenceKind?: SequenceKind;
  sequence?: InstrumentSequence[] = [];

  public constructor(init?: Partial<InstrumentSequence>) {
    Object.assign(this, init);
  }

}

export class Parameter {
  name: string;
  value: any;
  public constructor(init?: Partial<Parameter>) {
    Object.assign(this, init);
  }
}
