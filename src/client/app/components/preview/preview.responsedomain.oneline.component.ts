import { Component, Input } from '@angular/core';

@Component({
  selector: 'qddt-preview-rd-oneline',
  moduleId: module.id,
  styles: [
    `:host /deep/ .row {
       margin-left: auto;
       margin-right: auto;
       margin-bottom: 2px;
    }`
  ],
  template: `
<div *ngIf="responseDomain" class="row">
  <table *ngIf="displayLayout === 0">
    <tbody>
      <tr>
        <td *ngFor="let option of row; let idx=index">
          <span>
          <input name="{{responseDomain.id}}-group" type="radio" id="{{responseDomain.id}}option{{option.value}}" />
          <label [attr.for]="responseDomain.id + 'option' + option.value">{{option?.value}}</label>
          </span>
        </td>
      </tr>
    </tbody>
  </table>
</div>`,
  providers: [ ],
})

export class PreviewResponseDomainOneLineComponent {
  @Input() responseDomain: any;


}
