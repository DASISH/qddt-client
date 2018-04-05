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

export const  PUBLICATION_COLUMNS =  [
  new Column({ name: 'name', label: 'Name', sortable: true }),
  new Column({ name: 'purpose', label: 'Purpose', sortable: true }),
  new Column({ name: 'status', label: 'Publication Status', sortable: true }),
  new Column({ name: 'modified',  label: 'Modified', sortable: true, direction: 'desc' })
];

export const  CATEGORY_COLUMNS =  [
  new Column( { label: 'Label', name: 'label', sortable: true }),
  new Column( { label: 'Description', name: 'description', sortable: true }),
  new Column( { label: 'Type', name: 'categoryType', sortable: true } ),
  new Column( { label: 'Modified', name: 'modified', sortable: true, direction: 'desc'} )
];

export const QUESTIONITEM_COLUMNS = [
  new Column( { name: 'name', label: 'Name', sortable: true }),
  new Column( { name: 'question', label: 'Question Text', sortable: true }),
  new Column( { name: 'responseDomainName', label: 'ResponseDomain', sortable: true }),
  new Column( { name: 'modified', label: 'Modified', sortable: true, direction: 'desc' })
];

export const RESPONSEDOMAIN_COLUMNS = [
  new Column( { name: 'name', label: 'Name', sortable: true }),
  new Column( { name: 'question', label: 'Question Text', sortable: true }),
  new Column( { name: 'responseDomainName', label: 'ResponseDomain', sortable: true }),
  new Column( { name: 'modified', label: 'Modified', sortable: true, direction: 'desc' })
];

export const LIST_COLUMNS: Map<string, Column[]>  = new Map([
  ['questionitems', QUESTIONITEM_COLUMNS ],
  ['categories', CATEGORY_COLUMNS ],
  ['schemes', CATEGORY_COLUMNS ],
  ['responsedomains', RESPONSEDOMAIN_COLUMNS ],
  ['questions', QUESTION_CONSTRUCT_COLUMNS ],
  ['sequences', SEQUENCE_CONSTRUCT_COLUMNS ],
  ['publications', PUBLICATION_COLUMNS ]
]);

