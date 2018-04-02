import { Component, Input, OnInit } from '@angular/core';
import { RationalDescription } from './rationaldescription';

@Component({
  selector: 'qddt-rational',
  moduleId: module.id,
  styles: [':host /deep/ .hoverable .row { min-height:3rem; margin-bottom:0px;}'],
  templateUrl: './rational.component.html'
})

export class RationalComponent implements OnInit {
  @Input() element: any;
  @Input() formName: string;
  @Input() config: any;
  public saveOptionIndex: number;

  private _RationalIndex: number;
  private _Rational2Index: number;
  private savedId: any;
  private savedbasedOnObject: any;
  private originalId: any;
  private readonly rationalDescriptions = [
    new RationalDescription( { id: 0, name: 'Saved as work in progress', change: 'IN_DEVELOPMENT', showComment: true}),
    new RationalDescription( { id: 1, name: 'Saved as version', showComment: true, children: [
      new RationalDescription(  { id: 0, name: 'TypoOrNoMeaningChange', change: 'TYPO',
        description: 'Minor changes such as changes in punctuation, '
        + 'spacing, capitalization or spelling, and other typographical '
        + 'and orthographical changes that do not change the meaning.'}),
      new RationalDescription({ id: 1, name: 'MeaningChange',
        description: 'Any other change that could affect the meaning. '
        + 'If the amendment is considerable enough, review whether '
        + 'becomes a new element rather than a new version.',
        children: [
          new RationalDescription( {id: 0, name: 'Conceptual improvement', change: 'CONCEPTUAL',
            description: 'The change represents an amendment in wording '
            + 'in order to better cover the intended meaning, for example '
            + 'when a concept description wording is changed with aims of '
            + 'corresponding better with the intended concept'}),
          new RationalDescription({ id: 1, name: 'Real life change', change: 'EXTERNAL',
            description: `The change corresponds to a real life change`}),
          new RationalDescription({id: 2, name: 'Add content element', change: 'ADDED_CONTENT',
            description: 'A content element is added to the element inline or '
              + 'by reference, for example a name added to a question item etc.'}),
          new RationalDescription({id: 3, name: 'Other purpose', change: 'OTHER',
            description: 'The change is made for other purposes not found in the list'})
        ]}),
      ]}),
      new RationalDescription({ id: 2, name: 'Saved as new based-on', showComment: true,
        children: [
          new RationalDescription({ id: 0, name: 'Copy of source', change: 'BASED_ON',
            description: 'The element is an identical copy  of a source element'}),
          new RationalDescription({id: 1, name: 'Variant of source', change: 'BASED_ON',
            description: 'The element is different from (different ID), but '
            + 'based on a source element. If the amendment is not considerable,'
            + ' review whether becomes a new version rather than a new element.'}),
          new RationalDescription({id: 2, name: 'Translation of source', change: 'TRANSLATED',
            description: 'The element is a translation of a source element'})
        ]}),
    new RationalDescription({ id: 3, name: 'Saved as new', showComment: true, change: 'CREATED' }),
    new RationalDescription({ id: 4, name: 'Archive', showComment: true, change: 'ARCHIVED' })];

  constructor() {
    this._RationalIndex = -1;
    this._Rational2Index = -1;
    this.saveOptionIndex = 0;
    this.savedId = null;
  }

  ngOnInit() {
    if (this.config) {
      const hiddenIds: any[] = this.config.hidden || [];
      if (this.element.archived === undefined) {            // Hide Archived option if element don't have this field.
        hiddenIds.push(4);
      }
      for (const id of hiddenIds) {
        if (id < this.rationalDescriptions.length) {
          this.rationalDescriptions[id]['hidden'] = true;
        }
      }
    }
    this.originalId = this.element.id;
    this.element.changeComment = '';
    this.element.changeKind = 'IN_DEVELOPMENT';
  }

  onClickRational1(id: number) {
    this._RationalIndex = id;
    this._Rational2Index = -1;
    const rational = this.rationalDescriptions[this.saveOptionIndex].children[id];
    if (rational.change) {
      this.element.changeKind = rational.change;
    }
  }

  onClickRational2(rational: any) {
    this._Rational2Index = rational.id;
    if (rational.change) {
      this.element.changeKind = rational.change;
    }
  }

  onSelectOption(id: number) {
    this.saveOptionIndex = id;
    this._RationalIndex = -1;
    this._Rational2Index = -1;
    if (this.rationalDescriptions[id].change) {
      this.element.changeKind = this.rationalDescriptions[id].change;
    }
    if (id === 2) {
      this.savedbasedOnObject = this.element.basedOnObject;
      this.element.basedOnObject = null;
      if (this.element.id === null) {
        this.element.id = this.originalId;
      }
    } else if (id === 3) {
      this.savedId = this.element.id;
      this.element.basedOnObject = null;
      this.element.id = null;
      this.element.changeKind = null;
    } else {
      if (this.element.id === null) {
        this.element.id = this.savedId;
        this.element.basedOnObject = this.savedbasedOnObject;
      }
    }
  }

}
