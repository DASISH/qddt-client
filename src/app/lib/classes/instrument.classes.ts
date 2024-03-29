import { ActionKind, ElementKind } from '../enums';
import { ISelectOption, IEntityAudit, ITreeNode } from '../interfaces';
import { AbstractControlConstruct, isSequence, Parameter, ParameterKind, ConditionConstruct } from './controlconstruct.classes';
import { ElementRevisionRef } from './element-revision-ref';

import * as uuid from 'uuid';



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

export function getParameterKind(kind: string | ParameterKind): ParameterKind {
  return ParameterKind[kind];
}

export const mapTreeNodes = (nodes: TreeNodeRevisionRefImpl<AbstractControlConstruct>[]):
  TreeNodeRevisionRefImpl<AbstractControlConstruct>[] =>
  [].concat(nodes.flatMap(node =>
    (node.children && node.children.length > 0) ? [...mapTreeNodes(node.children)] : [node]));




export class Instrument implements IEntityAudit {
  id: string;
  label: string;
  name: string;
  description: string;
  instrumentKind = InstrumentKind[InstrumentKind.QUESTIONNAIRE];
  // study?: Study;
  comments: any[];
  xmlLang?: string;
  classKind = ElementKind[ElementKind.INSTRUMENT];
  root: TreeNodeRevisionRefImpl<AbstractControlConstruct>;
  parameterIn: Parameter[] = [];
  parameterOut = new Map<string, Parameter>();

  public constructor(init?: Partial<Instrument>) {
    Object.assign(this, init);
    if (!this.root) {
      this.root = new TreeNodeRevisionRefImpl<AbstractControlConstruct>({ name: 'root', elementKind: 'SEQUENCE_CONSTRUCT' });
    }
    if (init && init.root && init.root.children.length > 0) {
      this.initParameters();
    }
    if (this.root.children && this.root.children.length > 0) {
      this.root.children.forEach((item, idx, array) => {
        array[idx] = new TreeNodeRevisionRefImpl(item)
      })
    }
  }

  initParameters = () => mapTreeNodes(this.root.children).forEach((entity, index) => {
    console.groupCollapsed('Param init');
    entity.parameters.forEach((p) => {
      // p.id = entity.id;
      p.idx = index;
      if (getParameterKind(p.parameterKind) === ParameterKind.OUT) {
        if (!this.parameterOut.has(entity.id)) {
          console.debug('param set');
          this.parameterOut.set(entity.id, p);
        }
      } else {
        if (this.parameterIn.findIndex(f => f.id === p.id && f.name === p.name) < 0) {
          console.debug('param pushed');
          this.parameterIn.push(p);
        }
      }
      console.debug(p);
    });
    console.groupEnd();
  });
}
export class EventAction {
  action: ActionKind;
  ref: ElementRevisionRef;
  public constructor(init?: Partial<EventAction>) {
    Object.assign(this, init);
  }
}



export abstract class TreeNodeRevisionRef extends ElementRevisionRef implements ITreeNode {
  id: string;
  parameters: Parameter[] = [];
  children: TreeNodeRevisionRef[] = [];

  public constructor(init?: Partial<TreeNodeRevisionRef>) {
    super();
    Object.assign(this, init);
    if (!init.id) {
      this.id = uuid.v4();
    }
  }
}

export const isParamTrue = (parameter: Parameter) => {
  if (parameter && parameter.value && parameter.value.length > 0) {
    // console.debug(parameter);
    return (parameter.value[0].value === true || parameter.value[0].value === 'true')
  } else {
    return false;
  }
}



export class TreeNodeRevisionRefImpl<T extends AbstractControlConstruct> extends TreeNodeRevisionRef {
  element: T;
  children: TreeNodeRevisionRefImpl<T>[] = [];
  public constructor(init?: Partial<TreeNodeRevisionRef>) {
    super(init);
    this.elementKind = this.elementKind || this.element.classKind;
    if (this.element && this.parameters) {
      mergeParameters(this);
    }
    if (isSequence(this.element)) {
      console.debug('init new sequence')
      this.children = this.element.sequence.map(seq => new TreeNodeRevisionRefImpl(seq));
    }
  }
}

export const mergeParameters = (node: TreeNodeRevisionRefImpl<AbstractControlConstruct>) => {
  // update params from source, delete if no match
  // insert no match params in source
  console.groupCollapsed('MergeParameters');
  const paramOut = node.parameters.filter(f => (getParameterKind(f.parameterKind) === ParameterKind.OUT));
  const paramIn = node.parameters.filter(f => (getParameterKind(f.parameterKind) === ParameterKind.IN));

  node.element.parameterOut.forEach((po, index, listRef) => {
    const found = paramOut.find(f => f.name === po.name);
    if (found) {
      console.debug('p found assign(po) ' + po.name);
      listRef[index] = found;
      // po = found;
    } else {
      console.debug('p insert (po) ' + po.name);
      // po.id = node.id;
      node.parameters.push(po);
    }
  });

  node.element.parameterIn.forEach((pi, index, listRef) => {
    const found = paramIn.find(f => f.name === pi.name);
    if (found) {
      console.debug('p found assign(pi) ' + pi.name);
      listRef[index] = found;
      // pi = found;
    } else {
      console.debug('p insert push(pi) ' + pi.name);
      // pi.id = node.id;
      node.parameters.push(pi);
    }
  });
  console.groupEnd();
}

export const evaluateParameter = (node: TreeNodeRevisionRefImpl<ConditionConstruct>) => {
  console.groupCollapsed('EvaluateParameter');
  if (node.element) {
    const regex = new RegExp(/\[(\w*)]/gm);
    const expression = JSON.stringify(node.element.condition);
    const result = regex.exec(expression);
    // while( result.entries)
    if (result) {
      result.forEach(m => console.debug(m));
    } else {
      console.debug('no match inner?');
    }
  } else {
    console.debug('no match outer');
  }
  console.groupEnd();
}
