import {
  AfterViewInit,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges
} from '@angular/core';
import { RATIONAL_DESCRIPTIONS, RationalDescription } from './rationaldescription';

@Component({
  selector: 'qddt-rational',
  styles: [':host ::ng-deep .hoverable .row { min-height:3rem; margin-bottom:0px;}'],
  templateUrl: './rational.component.html'
})

export class RationalComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() element: any;
  @Input() formName: string;
  @Input() config: any;

  public readonly formId = Math.round(Math.random() * 10000);

  public saveOptionIndex: number;
  public rationalDescriptionsFiltered: RationalDescription[];
  public rationalDescriptions = RATIONAL_DESCRIPTIONS;

  public _RationalIndex: number;
  public _Rational2Index: number;
  public original = { id: '', basedOnObject: '', basedOnRevision: 0 };

  constructor() {
    this._RationalIndex = 1;
    this._Rational2Index = 0;
    this.saveOptionIndex = 0;
  }


  public getJson = () => JSON.stringify(this.element);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.element.isFirstChange()) {
      this.element.changeComment = '';
      this.original.id = this.element.id;
      this.original.basedOnObject = this.element.basedOnObject;
      this.original.basedOnRevision = this.element.basedOnRevision;
      this.onSelectOption(0);
    }

  }

  ngAfterViewInit(): void {
    document.querySelectorAll('SELECT').forEach(comp => M.FormSelect.init(comp));
  }

  ngOnInit() {
    if (this.config) {
      const hiddenIds = this.config.hidden || [];
      if (!('archived' in this.element)) {            // Hide Archived option if element don't have this field.
        hiddenIds.push(3);
      }
      this.rationalDescriptionsFiltered = this.rationalDescriptions.filter(f => !hiddenIds.find(id => id === f.id));
    }
  }

  onClickRational1(id: number) {
    // console.log('onClickRational1 ' + id);
    this._RationalIndex = id;
    this._Rational2Index = 0;
    const rational = this.rationalDescriptions[this.saveOptionIndex].children[id];
    if (rational.change) {
      this.element.changeKind = rational.change;
    } else {
      // set default value, in case user decides to go on without selecting an item...
      this.onClickRational2(rational.children[this._Rational2Index]);
    }
  }

  onClickRational2(rational: any) {
    // console.log('onClickRational2 ' + rational);
    this._Rational2Index = rational.id;
    if (rational.change) {
      this.element.changeKind = rational.change;
    }
  }

  onSelectOption(id: number) {
    this.saveOptionIndex = id;
    this._RationalIndex = -1;
    this._Rational2Index = 0;
    if (this.rationalDescriptions[id].change) {
      this.element.changeKind = this.rationalDescriptions[id].change;
    }
    if (id === 2) {  // BASED ON
      this.element.basedOnObject = this.original.id;
      this.element.basedOnRevision = null;
      // this.element.id = {};
    } else {
      this.element.id = this.original.id;
      this.element.basedOnObject = this.original.basedOnObject;
      this.element.basedOnRevision = this.original.basedOnRevision;
    }

  }

}
