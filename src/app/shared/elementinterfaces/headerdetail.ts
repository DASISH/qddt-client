import {ElementKind} from './elements';

export interface IHeaderDetail {
  icon: any;
  headerName: string;
  kind: ElementKind;
  action ?: string;
}

export  const HEADER_DETAILS: Map<string, IHeaderDetail>  = new Map([
  ['categories', { icon: 'view_comfy', headerName: 'Categories', kind: ElementKind.CATEGORY }],
  ['questionitems', { icon: 'view_agenda', headerName: 'QuestionItems' , kind: ElementKind.QUESTION_ITEM}],
  ['questions', { icon: 'view_agenda', headerName: 'Question constructs' , kind: ElementKind.QUESTION_CONSTRUCT}],
  ['sequences', { icon: 'format_line_spacing', headerName: 'Sequence construct', kind: ElementKind.SEQUENCE_CONSTRUCT }],
  ['schemes', { icon: 'view_module', headerName: 'Missing values', kind: ElementKind.CATEGORY }],
  ['responsedomains', { icon: 'blur_linear', headerName: 'Response domains', kind: ElementKind.RESPONSEDOMAIN }],
  ['publications', { icon: 'folder_special', headerName: 'Publication packages', kind: ElementKind.PUBLICATION }],
]);
