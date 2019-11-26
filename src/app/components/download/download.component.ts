import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ActionKind, ElementKind, getElementKind, IEntityEditAudit, IOtherMaterial } from '../../lib';
import { TemplateService } from '../template';
import * as FileSaver from 'file-saver';


@Component({
  selector: 'qddt-download',
  templateUrl: './download.component.html',
  styles: [
    '.collection.with-header .collection-header { padding: 5px 10px 5px 0px; background-color: unset; }',
    '.collection a.collection-item { color: #039be5; cursor: pointer; padding:5px 10px 5px 10px; background-color: unset; }'
  ],
})
export class FileDownloadComponent implements OnChanges {
  @Input() fileStore: File[] = [];
  @Input() entity: IEntityEditAudit;
  @Input() readonly = true;

  public showButton = false;
  public showUploadFileForm = false;
  public showXmlDownload = true;
  public label = '';

  constructor(private service: TemplateService) { }


  ngOnChanges(changes: SimpleChanges): void {
    if (changes.entity.currentValue) {
      const ek = getElementKind(this.entity.classKind);
      if (!this.readonly) {
        this.readonly = !this.service.can(ActionKind.Create, ek);
      }
      this.showXmlDownload = !(ek === ElementKind.SURVEY_PROGRAM || ek === ElementKind.STUDY);
      this.label = (this.entity.otherMaterials) ? 'External aid & Exports' : 'Exports ';
    }
    // console.log(this.entity || JSON);
    // try { M.updateTextFields(); } catch (Exception) { }
  }

  onDownloadFile(o: IOtherMaterial) {
    const fileName = o.originalName;
    this.service.getFile(o).then(
      (data) => { FileSaver.saveAs(data, fileName); },
      (error) => { throw error; });
  }


  getPdf(element: IEntityEditAudit) {
    const fileName = element.name + '-' + element.version.major + element.version.minor + '.pdf';
    this.service.getPdf(element).then(
      (data: any) => {
        FileSaver.saveAs(data, fileName);
      });
  }

  getXml(element: IEntityEditAudit) {
    const fileName = element.name + '-ddi32-' + element.version.major + element.version.minor + '.xml';
    this.service.getXML(element).then(
      (data: any) => {
        FileSaver.saveAs(data, fileName);
      });
  }

  onSelectFile(filename: any) {
    const list = filename.target.files as FileList;
    for (let i = 0; i < list.length; i++) {
      this.fileStore.push(list.item(i));
    }
    this.showUploadFileForm = false;
  }

  onMarkForDeletion(idx: number) {
    if (this.entity.otherMaterials && this.entity.otherMaterials.length > idx) {
      this.entity.otherMaterials.splice(idx, 1);
    }
  }

  onDeleteFileFromLocal(idx: number) {
    if (this.fileStore && this.fileStore.length > idx) {
      this.fileStore.splice(idx, 1);
    }
  }

}
