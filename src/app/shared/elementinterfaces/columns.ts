import {Column} from '../table/table.column';


export const  QUESTION_CONSTRUCT_COLUMNS = [
  new Column({ name: 'name', label: 'Construct Name', sortable: true }),
  new Column({ name: 'questionName', label: 'Question Name', sortable: true }),
  new Column({ name: 'questionText', label: 'Question Text', sortable: true }),
  new Column({ name: 'modified',  label: 'Modified', sortable: true, direction: 'desc' })
];

export const  SEQUENCE_CONSTRUCT_COLUMNS = [
  new Column({ label: 'Name', name: 'name', sortable: true }),
  new Column({ label: 'Description', name: 'description', sortable: true }),
  new Column({ label: 'Modified', name: 'modified', sortable: true, direction: 'desc' })
];

export const LIST_COLUMNS: Map<string, Column[]>  = new Map([
  ['questions', QUESTION_CONSTRUCT_COLUMNS ],
  ['sequences', SEQUENCE_CONSTRUCT_COLUMNS ]
]);

