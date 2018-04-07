import { ElementKind } from '../shared/elementinterfaces/elements';

export const PATH_KIND_MAP: Map<string, ElementKind>  = new Map([
  ['questionitems', ElementKind.QUESTION_ITEM ],
  ['categories', ElementKind.CATEGORY ],
  ['schemes', ElementKind.CATEGORY],
  ['responsedomains', ElementKind.RESPONSEDOMAIN ],
  ['questions', ElementKind.QUESTION_CONSTRUCT ],
  ['sequences', ElementKind.SEQUENCE_CONSTRUCT ],
  ['instruments', ElementKind.INSTRUMENT ],
  ['publications', ElementKind.PUBLICATION ]
]);
