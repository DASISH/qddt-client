import {Component, Input} from 'angular2/core';
import {ResponseDomain} from './responsedomain.service';

@Component({
  selector: 'responsedomain-numeric',
  moduleId: module.id,
  template: `<div class="row">
        <table>
          <tbody>
            <tr>
              <td *ngFor="#n of numerics;#idx=index">
                <span>
                 <input name="group-{{responseDomain.id}}" type="radio" id="option-{{responseDomain.id}}-{{idx}}" />
                 <label [attr.for]="'option-' + responseDomain.id + '-' + idx">{{n}}</label>
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>`,
  styles: [],
  pipes: [],
  directives: []
})

export class ResponsedomainNumericComponent {
  @Input() responseDomain: ResponseDomain;
  private low: number;
  private high: number;
  private numerics: number[];

  ngOnInit() {
    this.low = 0;
    this.high = 1;
    this.numerics = [];
    let rep = this.responseDomain.managedRepresentation;
    if (rep !== undefined) {
      if (rep.inputLimit !== undefined
        && rep.inputLimit.maximum !== undefined) {
        this.high = parseInt(rep.inputLimit.maximum);
      }
      if (rep.inputLimit !== undefined
        && rep.inputLimit.minimum !== undefined) {
        this.low = parseInt(rep.inputLimit.minimum);
      }
    }
    for (let i = this.low; i <= this.high; i++) {
      this.numerics.push(i);
    }
  }
}
