import { ActionKind, ElementKind } from '../enums';
import { Study, SequenceKind, ElementRevisionRef, UserResponse, ElementRevisionRefImpl, AbstractControlConstruct } from '.';
import { ISelectOption, IEntityAudit } from '../interfaces';
// import { v4 as uuidv4 } from 'uuid';

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

export const INSTRUMENT_MAP = [
  {
    id: InstrumentKind.QUESTIONNAIRE, value: 'QUESTIONNAIRE', label: 'Questionnaire',
    description: 'Set of pre-determined questions presented to study participants.'
  } as ISelectOption,
  {
    id: InstrumentKind.QUESTIONNAIRE_STRUCTURED, value: 'QUESTIONNAIRE_STRUCTURED', label: 'Questionnaire Structured',
    description: 'Set of pre-determined questions, a great majority of which are closed-ended, although there may be a small proportion of open-ended questions.'
  } as ISelectOption,
  {
    id: InstrumentKind.QUESTIONNAIRE_SEMISTRUCTURED, value: 'QUESTIONNAIRE_SEMISTRUCTURED', label: 'Questionnaire SemiStructured',
    description: 'Set of pre-determined questions, a significant proportion of which are open-ended (roughly one third to two thirds), and the rest are closed-ended.'
  } as ISelectOption,
  {
    id: InstrumentKind.QUESTIONNAIRE_UNSTRUCTURED, value: 'QUESTIONNAIRE_UNSTRUCTURED', label: 'Questionnaire Unstructured',
    description: 'Set of pre-determined questions, a great majority of which are open-ended, although there may be a small proportion of close-ended questions.'
  } as ISelectOption,
  {
    id: InstrumentKind.INTERVIEW_SCHEME_AND_THEMES, value: 'INTERVIEW_SCHEME_AND_THEMES', label: 'InterviewSchemeAndThemes',
    description: 'Themes, topics, and/or questions used in an interview. Can vary between loosely defined themes to more exactly formulated questions. There is more flexibility than in an unstructured questionnaire regarding which questions are asked of each participant and how they are conveyed.'
  } as ISelectOption,
  {
    id: InstrumentKind.DATA_COLLECTION_GUIDELINES, value: 'DATA_COLLECTION_GUIDELINES', label: 'DataCollectionGuidelines',
    description: 'Guidelines and directions that define the content of the data capture. Use a narrower term if possible.'
  } as ISelectOption,
  {
    id: InstrumentKind.DATACOLLECTIONGUIDELINES_OBSERVATIONGUIDE, value: 'DATACOLLECTIONGUIDELINES_OBSERVATIONGUIDE', label: 'DataCollectionGuidelines ObservationGuide',
    description: 'Guidelines regarding what will be observed. Depending on the study design, an observation guide can be more or less structured, ranging from exact specifications and scales to loosely formulated ideas.'
  } as ISelectOption,
  {
    id: InstrumentKind.DATACOLLECTIONGUIDELINES_DISCUSSIONGUIDE, value: 'DATACOLLECTIONGUIDELINES_DISCUSSIONGUIDE', label: 'DataCollectionGuidelines DiscussionGuide',
    description: 'Guidelines for a group discussion. Depending on the study design, a discussion guide can be more or less structured, ranging from exactly formulated questions to general ideas on what to discuss. For example, a list of topics to be discussed in a focus group, or themes formulated by a researcher to direct a blog discussion, etc.'
  } as ISelectOption,
  {
    id: InstrumentKind.DATACOLLECTIONGUIDELINES_SELFADMINISTEREDWRITINGSGUIDE, value: 'DATACOLLECTIONGUIDELINES_SELFADMINISTEREDWRITINGSGUIDE', label: 'DataCollectionGuidelines SelfAdministeredWritingsGuide',
    description: 'Guidelines regarding the desired, or expected content of self-written personal accounts or narratives from potential participants. The instructions can be supplied as part of the writing invitation or separately. For example, a writing competition announcement asking people with a life-threatening disease to describe how the disease affects their feelings, social relations and everyday life; or a writing invitation asking people to keep a diary of books read during a period of six months and the thoughts provoked by the books.'
  } as ISelectOption,
  {
    id: InstrumentKind.DATACOLLECTIONGUIDELINES_SECONDARYDATACOLLECTIONGUIDE,
    value: 'DATACOLLECTIONGUIDELINES_SECONDARYDATACOLLECTIONGUIDE', label: 'DataCollectionGuidelines SecondaryDataCollectionGuide',
    description: 'Guidelines specifying what data are to be collected from previously existing sources originally created for other purposes. For example, directions on how to select and code data from qualitative sources to create a quantitative dataset.'
  } as ISelectOption,
  {
    id: InstrumentKind.PARTICIPANT_TASKS, value: 'PARTICIPANT_TASKS', label: 'ParticipantTasks',
    description: 'A description of tasks that participants are asked to carry out as a part of the data collection process. For example, marking places on a map, taking photographs, telling a fairy tale, etc.'
  } as ISelectOption,
  {
    id: InstrumentKind.TECHNICAL_INSTRUMENTS, value: 'TECHNICAL_INSTRUMENTS', label: 'TechnicalInstruments',
    description: 'Instruments used to collect objective data like measurements, images, etc. For example, chronometers, scales, speedometers, blood pressure monitors, thermometers, x-ray machines, etc.'
  } as ISelectOption,
  {
    id: InstrumentKind.PROGRAMMING_SCRIPT, value: 'PROGRAMMING_SCRIPT', label: 'ProgrammingScript',
    description: 'Programming script written in a data query language that is used to extract specific data, for instance from online social networks.'
  } as ISelectOption,
  {
    id: InstrumentKind.OTHER, value: 'OTHER', label: 'Other',
    description: 'Use when the type of instrument is known, but not found in the list.'
  } as ISelectOption,
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
  get parameters(): Parameter[] {
    return [].concat(...this.sequence.map(seq => (seq.) ? seq.element.parameters : []));
  }

  public constructor(init?: Partial<Instrument>) {
    Object.assign(this, init);
    if (this.sequence) {
      this.sequence.forEach(seq => new InstrumentSequence(seq));
    } else {
      this.sequence = [];
    }
  }

  // public get parameters(): Map<string, Parameter> {
  //   return new Map(
  //     (this.sequence) ?
  //       [].concat(...this.sequence.map(s => [...this.getParametersFlatten(s)])) :
  //       []);
  // }

  // private getParametersFlatten(sequence: InstrumentSequence): Map<string, Parameter> {
  //   const children = new Map<string, Parameter>();
  //   return children.set(sequence.id, new Parameter({ name: sequence.elementRef.name }));

  // }


}

export class InstrumentSequence {
  id: string;
  elementRef: ElementRevisionRefImpl<AbstractControlConstruct>;
  sequenceKind?: SequenceKind;
  sequence?: InstrumentSequence[] = [];

  public constructor(init?: Partial<InstrumentSequence>) {
    Object.assign(this, init);
    if (this.elementRef.element) {
    }
  }

  toString(): string {
    return this.elementRef.name;
  }

}

export class Parameter {
  id: string;
  name: string;
  referencedId?: string;
  value: UserResponse[] = [];
  public constructor(init?: Partial<Parameter>) {
    Object.assign(this, init);
  }
}

export class EventAction {
  action: ActionKind;
  ref: InstrumentSequence | ElementRevisionRef;
  public constructor(init?: Partial<EventAction>) {
    Object.assign(this, init);
  }
}
