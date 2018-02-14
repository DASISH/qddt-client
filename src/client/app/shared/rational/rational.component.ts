import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'qddt-rational',
  moduleId: module.id,
  styles: [':host /deep/ .hoverable .row { min-height:3rem; margin-bottom:0px;}'],

  template: `
  <form class="row hoverable" [parentFormConnect]="formName">
    <div class="row">
      <div class="col left" *ngFor="let option of rationalDescriptions" [ngClass]="{hide: option.hidden}">
        <input  name="{{originalId}}-optiontypegroup" type="radio"
          id="{{originalId}}-option-type-{{option.id}}" (click)="onSelectOption(option.id)"
          [checked]="saveOptionIndex === option.id" />
        <label [attr.for]="originalId + '-option-type-' + option.id">{{ option.name }}</label>
      </div>
    </div>
    <div *ngFor="let option of rationalDescriptions;">
      <div class="row" *ngIf="option.id === saveOptionIndex && option.children.length > 0">
        <div class="row">
          <div class="input-field col s3">
            <select materialize="material_select" [ngModel]="_RationalIndex"
            name="{{originalId}}-rationals"
            (ngModelChange)="onClickRational1($event)">
            <option value="-1" disabled selected>Choose your rationale</option>
            <option *ngFor="let rational of option.children;"
              value="{{rational.id}}">{{ rational.name }}</option>
            </select>
            <label>Versioning Reason</label>
          </div>
          <div class="input-field col s8">
            <div class="card" >
              <span>{{ option.children[_RationalIndex]?.description }}</span>
            </div>
          </div>
        </div>
        <div *ngIf="_RationalIndex>=0">
          <div *ngFor="let child of option.children[_RationalIndex].children; let idx = index">
            <div class="col left">
              <input name="{{originalId}}-rationalgroup2" type="radio"
                id="{{originalId}}-rational2-type-{{idx}}" [checked]="_Rational2Index === idx"
                (click)="onClickRational2(child)"/>
              <label title="{{child.description}}" [attr.for]="originalId + '-rational2-type-' + idx">{{ child.name }}</label>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div *ngIf="saveOptionIndex >= 0 && rationalDescriptions[saveOptionIndex].showComment" class="row">
      <div class="input-field col s12">
        <input id="{{originalId}}-changeComment" class="validate" required minlength="4"
          name="{{originalId}}-changeComment" type="text" [(ngModel)]="element.changeComment" >
        <label for="{{originalId}}-changeComment"  data-error="Description is mandatory"  class="teal-text">Rationale for change</label>
      </div>
    </div>
  </form>
  `
})

export class RationalComponent implements OnInit {
  rationalDescriptions: any = [
    { 'id': 0, 'name': 'Saved as work in progress', 'showComment': true, 'change': 'IN_DEVELOPMENT', 'children': []},
    { 'id': 1, 'name': 'Saved as version', 'showComment': true,
      'children': [
      {
        'id': 0,
        'name': 'TypoOrNoMeaningChange',
        'change': 'TYPO',
        'description': 'Minor changes such as changes in punctuation, '
          + 'spacing, capitalization or spelling, and other typographical '
          + 'and orthographical changes that do not change the meaning.',
        'children': [],
      },
      {
        'id': 1,
        'name': 'MeaningChange',
        'description': 'Any other change that could affect the meaning. '
          + 'If the amendment is considerable enough, review whether '
          + 'becomes a new element rather than a new version.',
        'children': [
          {
            'id': 0,
            'name': 'Conceptual improvement',
            'change': 'CONCEPTUAL',
            'description': 'The change represents an amendment in wording '
            + 'in order to better cover the intended meaning, for example '
            + 'when a concept description wording is changed with aims of '
            + 'corresponding better with the intended concept'},
          {
            'id': 1,
            'name': 'Real life change',
            'change': 'EXTERNAL',
            'description': `The change corresponds to a real life change`
          },
          {
            'id': 2,
            'name': 'Add content element',
            'change': 'ADDED_CONTENT',
            'description': 'A content element is added to the element inline or '
              + 'by reference, for example a name added to a question item etc.'
          },
          {
            'id': 3,
            'name': 'Other purpose',
            'change': 'OTHER',
            'description': 'The change is made for other purposes not '
              + 'found in the list'
          }
        ]
      },
      ]},
    { 'id': 2, 'name': 'Saved as new based-on', 'showComment': true,
       'children': [
      {
        'id': 0,
        'name': 'Copy of source',
        'change': 'BASED_ON',
        'description': 'The element is an identical copy  of a source element'
      },
      {
        'id': 1,
        'name': 'Variant of source',
        'change': 'BASED_ON',
        'description': 'The element is different from (different ID), but '
          + 'based on a source element. If the amendment is not considerable,'
          + ' review whether becomes a new version rather than a new element.'
      },
      {
        'id': 2,
        'name': 'Translation of source',
        'change': 'TRANSLATED',
        'description': 'The element is a translation of a source element'
      }]
    },
    { 'id': 3, 'name': 'Saved as new', 'showComment': true, 'change': 'CREATED', 'children': [] },
    { 'id': 4, 'name': 'Archive', 'showComment': true, 'change': 'ARCHIVED', 'children': [] }
  ];
  @Input() element: any;
  @Input() formName: string;
  @Input() config: any;
  private _RationalIndex: number;
  private _Rational2Index: number;
  private saveOptionIndex: number;
  private savedId: any;
  private savedbasedOnObject: any;
  private originalId: any;

  constructor() {
    this._RationalIndex = -1;
    this._Rational2Index = -1;
    this.saveOptionIndex = 0;
    this.savedId = null;
  }

  ngOnInit() {
    if (this.config) {
      const hiddenIds: any[] = this.config.hidden || [];
      if (this.element.archived === undefined)            // Hide Archived option if element don't have this field.
        hiddenIds.push(4);
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
    if (rational['change'] !== undefined) {
      this.element.changeKind = rational['change'];
    }
  }

  onClickRational2(rational: any) {
    this._Rational2Index = rational.id;
    if (rational['change'] !== undefined) {
      this.element.changeKind = rational['change'];
    }
  }

  onSelectOption(id: number) {
    this.saveOptionIndex = id;
    this._RationalIndex = -1;
    this._Rational2Index = -1;
    if (this.rationalDescriptions[id]['change'] !== undefined) {
      this.element.changeKind = this.rationalDescriptions[id]['change'];
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
