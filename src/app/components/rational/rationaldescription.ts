export class RationalDescription {
  id: number;
  name: string;
  change: string;
  description: string;
  showComment = false;
  hidden = false;
  children: RationalDescription[] = [];

  public constructor(init?: Partial<RationalDescription>) {
    Object.assign(this, init);
  }
}


export const RATIONAL_DESCRIPTIONS = [
  new RationalDescription({ id: 0, name: 'Saved as work in progress', change: 'IN_DEVELOPMENT', showComment: true }),
  new RationalDescription({
    id: 1, name: 'Saved as version', showComment: true,
    children: [
      new RationalDescription({
        id: 0, name: 'TypoOrNoMeaningChange', change: 'TYPO',
        description: 'Minor changes such as changes in punctuation, '
          + 'spacing, capitalization or spelling, and other typographical '
          + 'and orthographical changes that do not change the meaning.'
      }),
      new RationalDescription({
        id: 1, name: 'MeaningChange',
        description: 'Any other change that could affect the meaning. '
          + 'If the amendment is considerable enough, review whether '
          + 'becomes a new element rather than a new version.',
        children: [
          new RationalDescription({
            id: 0, name: 'Conceptual improvement', change: 'CONCEPTUAL',
            description: 'The change represents an amendment in wording '
              + 'in order to better cover the intended meaning, for example '
              + 'when a concept description wording is changed with aims of '
              + 'corresponding better with the intended concept'
          }),
          new RationalDescription({
            id: 1, name: 'Real life change', change: 'EXTERNAL',
            description: `The change corresponds to a real life change`
          }),
          new RationalDescription({
            id: 2, name: 'Add content element', change: 'ADDED_CONTENT',
            description: 'A content element is added to the element inline or '
              + 'by reference, for example a name added to a question item etc.'
          }),
          new RationalDescription({
            id: 3, name: 'Other purpose', change: 'OTHER',
            description: 'The change is made for other purposes not found in the list'
          })
        ]
      }),
    ]
  }),
  new RationalDescription({
    id: 2, name: 'Saved as new based-on', showComment: true,
    children: [
      new RationalDescription({
        id: 0, name: 'Copy of source', change: 'NEW_COPY',
        description: 'The element is an identical copy  of a source element'
      }),
      new RationalDescription({
        id: 1, name: 'Variant of source', change: 'BASED_ON',
        description: 'The element is different from (different ID), but '
          + 'based on a source element. If the amendment is not considerable,'
          + ' review whether becomes a new version rather than a new element.'
      }),
      new RationalDescription({
        id: 2, name: 'Translation of source', change: 'TRANSLATED',
        description: 'The element is a translation of a source element'
      })
    ]
  }),
  new RationalDescription({ id: 3, name: 'Archive', showComment: true, change: 'ARCHIVED' })];
