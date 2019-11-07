import {
  AfterViewInit,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges
} from '@angular/core';
import { RATIONAL_DESCRIPTIONS , RationalDescription} from './rationaldescription';

@Component({
  selector: 'qddt-rational',
  styles: [':host ::ng-deep .hoverable .row { min-height:3rem; margin-bottom:0px;}'],
  templateUrl: './rational.component.html'
})

export class RationalComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() element: any;
  @Input() formName: string;
  @Input() config: any;

  public readonly formId = Math.round( Math.random() * 10000);

  public saveOptionIndex: number;
  public rationalDescriptionsFiltered: RationalDescription[];
  public rationalDescriptions = RATIONAL_DESCRIPTIONS;

  public _RationalIndex: number;
  public _Rational2Index: number;
  public originalId: any;

  private savedId: any;
  private savedbasedOnObject: any;

  constructor() {
    this._RationalIndex = 1;
    this._Rational2Index = 0;
    this.saveOptionIndex = 0;
    this.savedId = null;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.element.isFirstChange()) {
      this.element.changeComment = '';
      this.onSelectOption(0);
    }
    this.originalId = this.element.id;
    // console.log(this.element.changeKind);
  }

  ngAfterViewInit(): void {
    // document.querySelectorAll('SELECT').forEach( comp => M.FormSelect.init(comp));
    M.FormSelect.init(document.getElementById('SELECT-' + this.formId));
    console.log('init select');
  }

  ngOnInit() {
    if (this.config) {
      const hiddenIds = this.config.hidden || [];
      if (!('archived' in this.element)) {            // Hide Archived option if element don't have this field.
        hiddenIds.push(4);
      }
      this.rationalDescriptionsFiltered = RATIONAL_DESCRIPTIONS.filter(f => !hiddenIds.find(id => id === f.id));
    }
  }

  onClickRational1(id: number) {
    this._RationalIndex = id;
    this._Rational2Index = 0;
    const rational = RATIONAL_DESCRIPTIONS[this.saveOptionIndex].children[id];
    if (rational.change) {
      this.element.changeKind = rational.change;
    } else {
      // set default value, in case user decides to go on without selecting an item...
      this.onClickRational2(rational.children[this._Rational2Index]);
    }
    console.log('onClickRational1 ' + id );
  }

  onClickRational2(rational: any) {
    this._Rational2Index = rational.id;
    if (rational.change) {
      this.element.changeKind = rational.change;
    }
    console.log('onClickRational2 ' + rational );
  }

  onSelectOption(id: number) {
    this.saveOptionIndex = id;
    this._RationalIndex = -1;
    this._Rational2Index = 0;
    if (RATIONAL_DESCRIPTIONS[id].change) {
      this.element.changeKind = RATIONAL_DESCRIPTIONS[id].change;
    }
    if (id === 2) {
      this.savedbasedOnObject = this.element.basedOnObject;
      this.element.basedOnObject = null;
      this.element.modifiedBy = null;
      if (this.element.id === null) {
        this.element.id = this.originalId;
      }
    } else if (id === 3) {
      this.savedId = this.element.id;
      this.element.basedOnObject = null;
      this.element.modifiedBy = null;
      this.element.id = null;
      this.element.changeKind = null;
    } else {
      if (this.element.id === null) {
        this.element.id = this.savedId;
        this.element.basedOnObject = this.savedbasedOnObject;
      }
    }
    console.log('onSelectOption');
  }

}
