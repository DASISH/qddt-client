import { Component, Input, EventEmitter, Output } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HomeService } from '../home.service';
import {Topic} from '../home.classes';
import { IOtherMaterial } from '../../shared/classes/interfaces';
import { ElementKind } from '../../shared/classes/enums';

const filesaver = require('file-saver');

@Component({
  selector: 'qddt-topic-edit',
  moduleId: module.id,
  styles: [
    '.nomargin { margin:0; }',
    ':host /deep/ .hoverable { margin-bottom:0px;}',
    ':host /deep/ .hoverable .row { min-height:3rem; margin-bottom:0px;}'
  ],
  templateUrl: 'topic.edit.component.html'
})

export class TopicEditComponent  {
  @Input() topic: Topic;
  @Input() isVisible: boolean;
  @Output() savedEvent = new EventEmitter<any>();

  public showRevision = false;

  private showUploadFileForm = false;
  private readonly = false;
  private files: FileList;
  private fileStore = []
  private toDeleteFiles = [];

  constructor(private service: HomeService) { }


  onDownloadFile(o: IOtherMaterial) {
    const fileName = o.originalName;
    this.service.getFile(o).then(
      (data) => { filesaver.saveAs(data, fileName); },
      (error) => { throw error; });
  }


  onSelectFile(filename: any) {
    const list = filename.target.files as FileList;
    for (let i = 0; i < list.length; i++) {
      this.fileStore.push(list.item(i));
    }
    this.showUploadFileForm = false;
  }

  onMarkForDeletetion(idx: number) {
    if (this.topic.otherMaterials
      && this.topic.otherMaterials.length > idx) {
      const items = this.topic.otherMaterials.splice(idx, 1);
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


  public async onSave() {
    const formData: FormData = new FormData();
    const tg = this.topic;
    formData.append('topicgroup', JSON.stringify(tg));
    this.fileStore.forEach( (file) => { formData.append('files', file); });

    const result = await this.service.updateWithfiles(ElementKind.TOPIC_GROUP, formData).toPromise();
    this.topic = result;
    this.savedEvent.emit(result);

  }

}
