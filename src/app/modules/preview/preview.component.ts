import { AfterViewInit, Component, Input} from '@angular/core';
import {ElementEnumAware, ElementKind, IEntityAudit, PreviewService} from '../../lib';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'qddt-preview-element',

  styles: [
    'table { table-layout: fixed;}',
    ':host ::ng-deep .row { min-height: 1rem; margin-left: auto; margin-right: auto; margin-bottom: 2px; }',
    '.row .col { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }',
    'ul .collapsible { margin:unset; padding:5px; !important;}',
    'ul { border-color:lightyellow; }',
    'ul.question { border-color:#E8F5E9;}',
    'collapsible-header { display: flow-root; margin-bottom: 0px; margin-left: unset; }',
  ],
  templateUrl: './preview.component.html',
})
@ElementEnumAware
export class PreviewComponent implements AfterViewInit {
  @Input() element: IEntityAudit;
  @Input() showDetail = true;

  public instanceRefEnum = ElementKind;
  public revisionIsVisible = false;

  constructor(private service: PreviewService) { }

  public getElementKind(element: IEntityAudit): ElementKind {
    return ElementKind[element.classKind];
  }

  onGetPdf(element: IEntityAudit) {
    const fileName = element.name + '.pdf';
    this.service.getPdf(element).then((data: any) => { FileSaver.saveAs(data, fileName); });
  }


  ngAfterViewInit(): void {
    M.updateTextFields();
    // document.querySelectorAll('select')
    // .forEach( select => M.FormSelect.init(select));
  }


}
