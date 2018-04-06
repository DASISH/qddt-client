import { IVersion } from '../elementinterfaces/entityaudit';
import { ElementKind } from '../elementinterfaces/elements';


export class RevisionConfig {
  label: string;
  name: any[];
}

export const DEFAULT_CONFIG = [
  {name: 'name', label: 'Name'},
  {name: 'description', label: 'Desc'},
  {name: ['version'], label: 'Ver', 'init': function (version: IVersion) {
      return (version) ?  'V' + version.major + '.' + version.minor : ''; }
      },
];

const  QUESTION_CONSTRUCT_CONFIG =  [
  {name: 'name', label: 'Name'},
  {name: ['questionItem'], label: 'Question', 'init': function (q: any) {
      return (q && q['question'] ) ?  q['question'] : ''; } },

  {name: ['questionItem', 'version'], label: 'QI-Ver', 'init': function (version: IVersion) {
      return (version) ?  'V' + version.major + '.' + version.minor : ''; } },

  {name: ['preInstructions'], label: 'Pre', 'init': function (o: any) {
      if (o !== null && o !== undefined) {
        return o.map((element: any) => element['description'] || '').sort().join(',');
      }
      return '';
    }},

  {name: ['postInstructions'], label: 'Post', 'init': function (o: any) {
      if (o !== null && o !== undefined) {
        return o.map((element: any) => element['description'] || '').sort().join(',');
      }
      return '';
    }},

  {name: ['otherMaterials'], label: 'Files', 'init': function (o: any) {
      if (o !== null && o !== undefined) {
        return o.map((element: any) => element['originalName'] || '').sort().join(',');
      }
      return '';
    }}
  ];

const  QUESTIONITEM_CONFIG = [
  { name: 'name', label: 'Name'},
  { name: 'question', label: 'question'},
  { name: 'intent', label: 'Intent'},
  { name: ['responseDomain', 'name'], label: 'responseDomain'},
  { name: ['responseDomain', 'version'], label: 'RespD', 'init': function (version: IVersion) {
      return 'V' + version.major + '.' + version.minor ; } }
];

const  CATEGORY_CONFIG = DEFAULT_CONFIG.concat(
    [ {name: ['children'], label: 'Cat', 'init': function (o: any) {
        return (o) ? o.map((element: any) => element['label'] || '').sort().join(',') : ''; } } ]
);

// export const  RESPONSEDOMAIN_CONFIG = [];
// export const  SEQUENCE_CONSTRUCT_CONFIG = [];

const  PUBLICATION_CONFIG = [
  { name: 'name', label: 'Name' },
  { name: 'purpose', label: 'Purpose' },
  { name: 'status', label: 'Status' }
  ];


export const LIST_CONFIG: Map<ElementKind, any[]>  = new Map([
  [ElementKind.QUESTION_ITEM, QUESTIONITEM_CONFIG ],
  [ElementKind.CATEGORY, CATEGORY_CONFIG ],
  [ElementKind.QUESTION_CONSTRUCT, QUESTION_CONSTRUCT_CONFIG ],
  [ElementKind.PUBLICATION, PUBLICATION_CONFIG ]
]);
