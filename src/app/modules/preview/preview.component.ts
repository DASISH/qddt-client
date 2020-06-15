import { AfterViewInit, Component, Input, OnChanges } from '@angular/core';
import { ElementEnumAware, ElementKind, IEntityAudit, PreviewService } from '../../lib';
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
export class PreviewComponent implements AfterViewInit, OnChanges {
  @Input() element: IEntityAudit;
  @Input() showDetail = true;
  @Input() inParameters: Parameter[] = [];

  public instanceRefEnum = ElementKind;
  public revisionIsVisible = false;
  public readonly compId = Math.round(Math.random() * 10000);
  private readonly hide = [ElementKind.AGENCY, ElementKind.AUTHOR, ElementKind.CONDITION_CONSTRUCT,
  ElementKind.INSTRUCTION, ElementKind.STATEMENT_CONSTRUCT, ElementKind.INSTRUCTION];

  constructor(private service: PreviewService) { }


  public ngOnChanges(changes: SimpleChanges): void {
    // if (this.element && this.element. && changes.inParameters && changes.inParameters.currentValue) {
    //   this.statement.inParameter =
    //     this.statement.inParameter.map(obj => this.inParameters.find(o => o.name === obj.name) || obj);
    // }
  }

  public ngAfterViewInit(): void {
    M.updateTextFields();
  }

  public getElementKind(element: IEntityAudit): ElementKind {
    return ElementKind[element.classKind];
  }

  public onGetPdf(element: IEntityAudit) {
    const fileName = element.name + '.pdf';
    this.service.getPdf(element).then((data: any) => { FileSaver.saveAs(data, fileName); });
  }

  public hideElement(element: IEntityAudit): boolean {
    const idx = this.getElementKind(element).valueOf();
    const result = this.hide.findIndex(p => p.valueOf() === idx);
    return (result < 0);
  }

  public getParam(param: Parameter, divider: string): string {
    // if (this.inParameters) {
    //   this.sequenceConstruct.inParameter =
    //     this.sequenceConstruct.inParameter.map(obj => this.inParameters.find(o => o.name === obj.name) || obj);
    // }
    return param.name + divider + ((param.value) ? param.value.map(p => '[' + p.value + ':' + p.label + ']').join(',') : '?');
  }

}
