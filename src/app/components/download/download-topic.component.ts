import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { ActionKind, ElementKind, getElementKind, IEntityEditAudit, IOtherMaterial, saveAs, hasChanges } from '../../lib';
import { TemplateService } from '../template';


@Component({
  selector: 'qddt-download-topic',
  templateUrl: './download-topic.component.html',
  styles: [
    '.collection.with-header .collection-header { padding: 5px 10px 5px 0px; background-color: unset; }',
    '.collection a.collection-item { color: #039be5; cursor: pointer; padding:5px 10px 5px 10px;  }',
  ],
})
export class DownloadTopicComponent implements OnChanges {
  @Input() fileStore: File[] = [];
  @Input() entity: IEntityEditAudit;
  @Input() readonly = true;
  @Input() isHidden = false;
  @Output() entityChanged = new EventEmitter<IEntityEditAudit>();

  public showButton = false;
  public showUploadFileForm = false;
  public showXmlDownload = true;
  public label = '';

  constructor(private service: TemplateService) { }


  ngOnChanges(changes: SimpleChanges): void {
    if (hasChanges(changes.entity)) {
      const ek = getElementKind(this.entity.classKind);
      this.readonly = !this.service.can(ActionKind.Create, ek);
      this.showXmlDownload = !(ek === ElementKind.SURVEY_PROGRAM || ek === ElementKind.STUDY);
      this.label = (this.entity.otherMaterials) ? 'External aid & Exports' : 'Exports ';
    }
  }

  toggleForm() {
    if (this.isHidden) {
      this.isHidden = false;
    }
    this.showUploadFileForm = !this.showUploadFileForm;
  }

  onDownloadFile(o: IOtherMaterial) {
    const fileName = o.originalName;
    this.service.getFile(o).then(
      (data) => { saveAs(data, fileName, o.fileType); },
      (error) => { throw error; });
  }

  // onUpladFiles() {
  //   const formData = new FormData();
  //   this.fileStore.forEach((file) => { formData.append('files', file); });
  //   this.service.uploadFile(this.entity.id, formData)
  // }


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
        saveAs(data, fileName, 'text/xml');
      });
  }

  onSelectFile(filename: any) {
    const list = filename.target.files as FileList;
    for (let i = 0; i < list.length; i++) {
      this.fileStore.push(list.item(i));
    }
    const formData = new FormData();
    this.fileStore.forEach((file) => { formData.append('files', file); });
    this.service.uploadFile(this.entity.id, formData).subscribe(result => this.entity = result)
    // this.fileStore.forEach(file => {
    //   this.service.uploadFile(this.entity.id, file).toPromise().then(result => console.log(result))
    // });
    // this.onUpladFiles()
    this.showUploadFileForm = false;
  }

  onMarkForDeletion(idx: number) {
    if (this.entity.otherMaterials && this.entity.otherMaterials.length > idx) {
      this.service.deleteTopicFile(this.entity.otherMaterials.splice(idx, 1)[0])
        .then(result => console.debug(result));
    }

  }

  onDeleteFileFromLocal(idx: number) {
    if (this.fileStore && this.fileStore.length > idx) {
      this.fileStore.splice(idx, 1);
    }
  }

}
