import { IVersion, ElementKind  } from '../../lib';


export class RevisionConfig {
  label: string;
  name: string | (string | number)[];
  init?: (item) => string;
}

export const DEFAULT_CONFIG: RevisionConfig[] = [
  { name: 'name', label: 'Name' },
  { name: 'description', label: 'Desc' },
  { name: 'changeComment', label: 'cComment' },
  { name: 'changeKind', label: 'cKind' },
  {
    name: ['modified'], label: 'Modified',
    init (o: number) { const date = new Date(); date.setTime(o); return date.toLocaleString(); }
  },
  { name: ['_embedded', 'modifiedBy', 'name'], label: 'User' },
  {
    name: ['version'], label: 'Ver', init (version: IVersion) {
      return (version) ? 'V' + version.major + '.' + version.minor : '';
    }
  }
];

const QUESTION_CONSTRUCT_CONFIG = DEFAULT_CONFIG.concat([
  { name: ['questionItemRef', 'text'], label: 'Question' },
  {
    name: ['questionItemRef', 'version'], label: 'QI-Ver',
    init (version: IVersion) { return (version) ? 'V' + version.major + '.' + version.minor : ''; }
  },
  {
    name: ['universe'], label: 'Uni',
    init (o: any) { return (o) ? o.map((element) => element.description || '').sort().join(',') : ''; }
  },
  {
    name: ['preInstructions'], label: 'Pre',
    init (o: any) { return (o) ? o.map((element) => element.description || '').sort().join(',') : ''; }
  },
  {
    name: ['postInstructions'], label: 'Post',
    init (o: any) { return (o) ? o.map((element) => element.description || '').sort().join(',') : ''; }
  },
  {
    name: ['otherMaterials'], label: 'Files',
    init (o: any) { return (o) ? o.map((element) => element.originalName || '').sort().join(',') : ''; }
  }
]);

const QUESTIONITEM_CONFIG = DEFAULT_CONFIG.concat([
  { name: 'question', label: 'question' },
  { name: 'intent', label: 'Intent' },
  {
    name: ['responseDomainRef', 'name'], label: 'RD-Name',
    init (name) { return name; }
  },
  {
    name: ['responseDomainRef', 'version'], label: 'RD-Ver',
    init (version: IVersion) { return (version) ? 'V' + version.major + '.' + version.minor : ''; }
  },
]);

const CATEGORY_CONFIG = DEFAULT_CONFIG.concat([
  {
    name: ['children'], label: 'Cat',
    init (o: any) { return (o) ? o.map((element: any) => element.label || '').sort().join(',') : ''; }
  }]
);

const SEQUENCE_CONSTRUCT_CONFIG = DEFAULT_CONFIG.concat([
  { name: 'sequenceKind', label: 'Kind' },
  {
    name: ['sequence'], label: 'Sequence',
    init (o: any) { return (o) ? o.map((element) => element.name || '').sort().join(',') : ''; }
  },
]);

const PUBLICATION_CONFIG = DEFAULT_CONFIG.concat([
  { name: 'purpose', label: 'Purpose' },
  { name: ['status', 'label'], label: 'Status' }
]);

const TOPIC_CONFIG = DEFAULT_CONFIG.concat([
  {
    name: ['otherMaterials'], label: 'Files',
    init (o: any) { return (o) ? o.map((element) => element.originalName || '').sort().join(',') : ''; }
  }
])
// export const  RESPONSEDOMAIN_CONFIG = [];
// Responsedomain has subtypes that config depends on number of element, it is not static



export const LIST_CONFIG: Map<ElementKind, RevisionConfig[]> = new Map([
  [ElementKind.QUESTION_ITEM, QUESTIONITEM_CONFIG],
  [ElementKind.CATEGORY, CATEGORY_CONFIG],
  [ElementKind.QUESTION_CONSTRUCT, QUESTION_CONSTRUCT_CONFIG],
  [ElementKind.SEQUENCE_CONSTRUCT, SEQUENCE_CONSTRUCT_CONFIG],
  [ElementKind.PUBLICATION, PUBLICATION_CONFIG],
  [ElementKind.TOPIC_GROUP, TOPIC_CONFIG]
]);
