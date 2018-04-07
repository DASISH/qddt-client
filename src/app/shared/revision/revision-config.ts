import { IVersion } from '../elementinterfaces/entityaudit';
import { ElementKind } from '../elementinterfaces/elements';


export class RevisionConfig {
  label: string;
  name: string|(string|number)[];
  init?: (item) => string;
}

export const DEFAULT_CONFIG: RevisionConfig[] = [
  {name: 'name', label: 'Name'},
  {name: 'description', label: 'Desc'},
  {name: 'changeComment', label: 'cComment'},
  {name: 'changeKind', label: 'cKind'},
  {name: ['modified'], label: 'Modified',
    init: function(o: number ) { const date = new Date(); date.setTime(o); return date.toLocaleString(); } },
  {name: ['modifiedBy', 'username'], label: 'User'},
  {name: ['version'], label: 'Ver', init: function (version: IVersion ) {
    return (version) ?  'V' + version.major + '.' + version.minor : ''; } }
];


const  QUESTION_CONSTRUCT_CONFIG = DEFAULT_CONFIG.concat( [
  {name: 'questionText', label: 'Question' },
  {name: ['questionItem', 'version'], label: 'QI-Ver',
    init: function (version: IVersion) { return (version) ?  'V' + version.major + '.' + version.minor : ''; } },
  {name: ['preInstructions'], label: 'Pre',
    init: function (o: any) { return  (o) ? o.map((element ) => element['description'] || '').sort().join(',') : '' ; } },
  {name: ['postInstructions'], label: 'Post',
    init: function (o: any) { return (o) ? o.map((element ) => element['description'] || '').sort().join(',') : ''; } },
  {name: ['otherMaterials'], label: 'Files',
    init: function (o: any) { return (o) ? o.map((element ) => element['originalName'] || '').sort().join(',') : ''; } }
  ]);

const  QUESTIONITEM_CONFIG = DEFAULT_CONFIG.concat( [
  { name: 'question', label: 'question'},
  { name: 'intent', label: 'Intent'},
  { name: ['responseDomain', 'name'], label: 'RD-Name',
      init: function(name) { return name; } },
  { name: ['responseDomain', 'version'], label: 'RD-Ver',
      init: function (version: IVersion) { return (version) ?  'V' + version.major + '.' + version.minor : ''; } },
  ]);

const  CATEGORY_CONFIG = DEFAULT_CONFIG.concat([
  {name: ['children'], label: 'Cat',
    init: function (o: any) { return (o) ? o.map((element: any) => element['label'] || '').sort().join(',') : ''; } } ]
);

const  SEQUENCE_CONSTRUCT_CONFIG = DEFAULT_CONFIG.concat([
  { name: 'sequenceKind', label: 'Kind' },
  { name: ['sequence'], label: 'Sequence',
    init: function (o: any) { return  (o) ? o.map((element ) => element['name'] || '').sort().join(',') : '' ; } },
]);

const  PUBLICATION_CONFIG = DEFAULT_CONFIG.concat( [
  { name: 'purpose', label: 'Purpose' },
  { name: ['status', 'label'], label: 'Status' }
  ]);

// export const  RESPONSEDOMAIN_CONFIG = [];
// Responsedomain has subtypes that config depends on number of element, it is not static



export const LIST_CONFIG: Map<ElementKind, RevisionConfig[]>  = new Map([
  [ElementKind.QUESTION_ITEM, QUESTIONITEM_CONFIG ],
  [ElementKind.CATEGORY, CATEGORY_CONFIG ],
  [ElementKind.QUESTION_CONSTRUCT, QUESTION_CONSTRUCT_CONFIG ],
  [ElementKind.SEQUENCE_CONSTRUCT, SEQUENCE_CONSTRUCT_CONFIG ],
  [ElementKind.PUBLICATION, PUBLICATION_CONFIG ]
]);
