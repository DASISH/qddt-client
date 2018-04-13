import { Component, Input, OnInit } from '@angular/core';
import { RATIONAL_DESCRIPTIONS } from './rationaldescription';

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
  public readonly rationalDescriptions = RATIONAL_DESCRIPTIONS;

  public _RationalIndex: number;
  public _Rational2Index: number;
  public originalId: any;

  private savedId: any;
  private savedbasedOnObject: any;

  constructor() {
    this._RationalIndex = -1;
    this._Rational2Index = -1;
    this.saveOptionIndex = 0;
    this.savedId = null;
  }

  ngOnInit() {
    if (this.config) {
      const hiddenIds = this.config.hidden || [];
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
