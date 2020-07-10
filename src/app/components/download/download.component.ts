import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ActionKind, ElementKind, getElementKind, IEntityEditAudit, IOtherMaterial, saveAs } from '../../lib';
import { TemplateService } from '../template';


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
      (data) => { saveAs(data, fileName, o.fileType); },
      (error) => { throw error; });
  }


  getPdf(element: IEntityEditAudit) {
    const fileName = element.name + '-' + element.version.major + element.version.minor + '.pdf';
    this.service.getPdf(element).then(
      (data: any) => {
        saveAs(data, fileName, 'application/pdf');
      });
  }

  getXml(element: IEntityEditAudit) {
    const fileName = element.name + '-ddi32-' + element.version.major + element.version.minor + '.xml';
    this.service.getXML(element).then(
      (data: any) => {
        saveAs(data, fileName, 'application/xml');
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


  // public saveAs(blob: Blob, fileName: string, type: string): void {
  //   const newBlob = new Blob([blob], { type });

  //   // IE doesn't allow using a blob object directly as link href
  //   // instead it is necessary to use msSaveOrOpenBlob
  //   if (window.navigator && window.navigator.msSaveOrOpenBlob) {
  //     window.navigator.msSaveOrOpenBlob(newBlob);
  //     return;
  //   }

  //   // For other browsers:
  //   // Create a link pointing to the ObjectURL containing the blob.
  //   const objectURL = window.URL.createObjectURL(newBlob);

  //   const link = document.createElement('a');
  //   link.href = objectURL;
  //   link.download = fileName;
  //   // this is necessary as link.click() does not work on the latest firefox
  //   link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));

  //   setTimeout(function () {
  //     // For Firefox it is necessary to delay revoking the ObjectURL
  //     window.URL.revokeObjectURL(objectURL);
  //     link.remove();
  //   }, 100);
  // }

}
