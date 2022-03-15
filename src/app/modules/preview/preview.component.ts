import { Category } from 'src/app/lib';
import { AfterViewInit, Component, Input } from '@angular/core';
import { ElementEnumAware, ElementKind, IEntityAudit, PreviewService, Parameter, saveAs } from '../../lib';

@Component({
  selector: 'qddt-preview-element',
  styles: [
    'table { table-layout: fixed;}',
    ':host ::ng-deep .row { min-height: 1rem; margin-left: auto; margin-right: auto; margin-bottom: 2px; }',
    '.row .col { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }',
    'ul { border-color:lightyellow; }',
    'ul.question { border-color:#E8F5E9;}',
    'ul .collapsible { margin:unset; padding:5px;}',
    'collapsible-header { display: flow-root; margin-bottom: 0px; margin-left: unset; }'
  ],
  templateUrl: './preview.component.html'
})

@ElementEnumAware
export class PreviewComponent implements AfterViewInit {
  @Input() element: IEntityAudit;
  @Input() showDetail = true;
  @Input() inParameters = new Map<string, Parameter>()

  public instanceRefEnum = ElementKind;
  public revisionIsVisible = false;
  // public readonly compId = Math.round(Math.random() * 10000);
  public readonly elementAsMissing = (element: IEntityAudit): Category => new Category(element);

  private readonly hide = [ElementKind.AGENCY, ElementKind.AUTHOR, ElementKind.CONDITION_CONSTRUCT,
  ElementKind.INSTRUCTION, ElementKind.STATEMENT_CONSTRUCT, ElementKind.INSTRUCTION];

  constructor(private service: PreviewService) { }

  public ngAfterViewInit(): void {
    M.updateTextFields();
  }

  public getElementKind(element: IEntityAudit): ElementKind {
    return ElementKind[element.classKind];
  }

  public onGetPdf(element: IEntityAudit) {
    const fileName = element.name + '.pdf';
    this.service.getPdf(element).then((data: any) => { saveAs(data, fileName, 'application/pdf'); });
  }

  public hideElement(element: IEntityAudit): boolean {
    const idx = this.getElementKind(element).valueOf();
    const result = this.hide.findIndex(p => p.valueOf() === idx);
    return (result < 0);
  }


}

