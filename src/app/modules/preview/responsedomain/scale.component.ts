import { Component, Input, OnChanges, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { Category, UserResponse, Parameter } from '../../../lib/classes';

class ScaleHead {
  // colspan: number;
  // class: string;
  label: string;
  // width: number;
}

@Component({
  selector: 'qddt-preview-rd-scale',

  templateUrl: './scale.component.html',
  styles: [
    'table { table-layout: fixed; }',
    'td, th { text-align: right;}',
    '[type="radio"] + label { padding-left: 25px; }'
  ]
})


export class ResponsedomainScaleComponent implements OnChanges, AfterViewInit {
  @Output() selectedEvent = new EventEmitter<UserResponse[]>();
  @Input() managedRepresentation: Category;
  @Input() displayLayout = 0;
  @Input() numOfRows = 1;
  @Input() inputGroupName = 'option-select'
  @Input() inParameters: Map<string, Parameter>
  @Input() parameterIn: Parameter[] = [];

  public headers: ScaleHead[];
  public columns: UserResponse[];
  public rows: any;
  public max = 5;
  public min = 1;
  public stepUnit = 1;
  public compId = Math.round(Math.random() * 10000);

  public numberOfSteps = (max, min, step) => Math.floor(((max - min) / step));

  public ngOnChanges() {
    if (this.managedRepresentation) {
      const rep = this.managedRepresentation;
      this.columns = [];
      this.headers = [];
      this.rows = new Array(this.numOfRows).fill(1);

      if (rep.inputLimit) {
        this.max = rep.inputLimit.maximum;
        this.min = rep.inputLimit.minimum;
        this.stepUnit = rep.inputLimit.stepUnit;
      }

      if (this.numberOfSteps(this.max, this.min, this.stepUnit) > 15) {
        const elems = document.querySelectorAll('input[type=range]');
        M.Range.init(elems);
      }

      if (this.displayLayout > 0) {
        this.buildVerticalColumns();
      } else {
        this.buildHorizontalColumns();
      }
    }
  }

  public ngAfterViewInit(): void {
    const elems = document.querySelectorAll('input[type=range]');
    M.Range.init(elems);

  }


  public insertParam(text: string): string {
    this.parameterIn.forEach(p => {
      if (p.value) {
        text = text.replace(
          new RegExp('\\[' + p.name + '\\]', 'ig'), p.value.map(pp => (pp.label) ? pp.label : pp.value).join(','));
      }
    });
    return text;
  }

  public checkOption(option: any | UserResponse) {
    if (option instanceof UserResponse) {
      this.selectedEvent.emit([{ label: this.insertParam(option.label), value: option.value }]);
    } else {
      this.selectedEvent.emit([{ label: '', value: option }]);
    }
  }

  private buildHorizontalColumns() {
    this.columns = [];
    this.headers = [];
    const rep = this.managedRepresentation;

    if (!rep) { return; }

    const categories = rep.anchors.map(x => Object.assign({}, x))
      .sort((a, b) => +a.code.value - +b.code.value);

    for (let i = this.min; i <= this.max; i += this.stepUnit) {
      const current = categories.find(category => category.code && +category.code.value === i);
      this.columns.push({ label: current !== undefined ? current.label : '', value: i });
      this.headers.push({ label: current !== undefined ? current.label : '' });

    }
  }

  private buildVerticalColumns() {
    this.rows = [];
    this.headers = [];
    let categories: any[] = [];
    const rep = this.managedRepresentation;
    if (rep !== undefined && rep.anchors !== undefined) {
      categories = rep.anchors;
    }
    for (let i = this.min; i <= this.max; i++) {
      const c = categories
        .find(category => category.code && category.code.getValue() === i);
      this.rows.push({ label: c !== undefined ? c.label : '', value: i });
    }
  }


}
