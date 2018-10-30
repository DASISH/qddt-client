
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ActionKind, IEntityEditAudit, IOtherMaterial } from '../classes';
import { TemplateService } from '../../template/template.service';

const filesaver = require('file-saver');

@Component({
  selector: 'qddt-download',
  templateUrl: './download.component.html',
  styles: [
    '.collection {border:none; }',
    ':host /deep/ .col { padding-top: 0.5rem;}',
    '.collection.with-header .collection-item { margin-bottom:0px ;border-bottom: none; padding: 0 10px 0 15px; }',
    '.collection.with-header .collection-header { border-bottom: none; padding: 0px; background-color: unset; }',
    '.collection .collection-item { background-color: unset; }',
  ],
})
export class QddtDownload implements OnChanges {
  @Input() fileStore: File[] = [];
  @Input() entity: IEntityEditAudit;
  @Input() readonly = true;

  public showUploadFileForm = false;
  public toDeleteFiles: File[] = [];
  public label = '';

  constructor(private service: TemplateService) {
    if (!this.readonly) {
      this.readonly = !this.service.can(ActionKind.Create, service.getElementKind(this.entity.classKind));
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['entity'].currentValue) {
      this.label = (this.entity['otherMaterials']) ? 'External aid & Exports' : 'Exports ';
    }
    // try { Materialize.updateTextFields(); } catch (Exception) { }
  }

  onDownloadFile(o: IOtherMaterial) {
    const fileName = o.originalName;
    this.service.getFile(o).then(
      (data) => { filesaver.saveAs(data, fileName); },
      (error) => { throw error; });
  }


  getPdf(element: IEntityEditAudit) {
    const fileName = element.name + '-' + element.version.major + element.version.minor + '.pdf';
    this.service.getPdf(element).then(
      (data: any) => {
        filesaver.saveAs(data, fileName);
      });
  }

  getXml(element: IEntityEditAudit) {
    const fileName = element.name + '-ddi32-' + element.version.major + element.version.minor + '.xml';
    this.service.getXML(element).then(
      (data: any) => {
        filesaver.saveAs(data, fileName);
      });
  }

  onSelectFile(filename: any) {
    const list = filename.target.files as FileList;
    for (let i = 0; i < list.length; i++) {
      this.fileStore.push(list.item(i));
    }
    this.showUploadFileForm = false;
  }

  onMarkForDeletetion(idx: number) {
    if (this.entity['otherMaterials']
      && this.entity['otherMaterials'].length > idx) {
      const items = this.entity['otherMaterials'].splice(idx, 1);
      if (items.length > 0) {
        this.toDeleteFiles.push(items[0]);
      }
    }
  }

  onDeleteFileFromLocal(idx: number) {
    if (this.fileStore && this.fileStore.length > idx) {
      this.fileStore.splice(idx, 1);
    }
  }

}
