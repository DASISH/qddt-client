import { Component, Input, EventEmitter, Output } from '@angular/core';
import { TopicService, Topic } from './topic.service';
import { Observable } from 'rxjs/Observable';

const saveAs = require('file-saver');

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
  @Output() topicSavedAction = new EventEmitter<any>();

  public showRevision = false;

  private showUploadFileForm: boolean;
  private showUploadedFiles: boolean;
  private showDeletebutton= false;
  private showbutton= false;
  private readonly= false;
  private files: FileList;
  private fileStore: any[];
  private toDeleteFiles: any[];
  private basedonRef: any;

  constructor(private service: TopicService) {
    this.showUploadFileForm = false;
    this.showUploadedFiles = false;
    this.fileStore = [];
    this.toDeleteFiles = [];
  }


  onDownloadFile(o: any) {
    const fileName = o.originalName;
    this.service.getFile(o.id).then(
      (data: any) => {
        saveAs(data, fileName);
      });
  }

  onSelectFile(filename: any) {
    this.files = filename.target.files;
  }

  onDeleteFile(idx: number) {
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

  onUploadFile() {
    this.fileStore.push(this.files);
    this.showUploadFileForm = false;
    this.files = null;
  }

  onSave() {
    this.isVisible = false;
    const topic = this.topic;
    const files = this.fileStore;
    const len = files.length;
    let source = Observable.of({});
    const toDeleteFiles = this.toDeleteFiles;
    if (len > 0 || toDeleteFiles.length > 0) {
      source = Observable.range(0, len + toDeleteFiles.length)
        .flatMap((x: any) => {
          if (x < len) {
            const file = files[x];
            return this.service.uploadFile(topic.id, file);
          } else {
            const file = toDeleteFiles[x - len];
            return this.service.deleteFile(file.id);
          }
        });
    }
    let index = 0;
    const service = this.service;
    const saveAction = this.topicSavedAction;
    source.subscribe(
      function (x: any) {
        if (index < len && x.id !== undefined && x.id !== null) {
          topic['otherMaterials'].push(x);
          index = index + 1;
        }
      },
      function (error: any) {
        throw error;
      },
      function () {
        service.edit(topic).subscribe((result: any) => {
          this.topic = result;
          saveAction.emit(result);
        });
      });
  }

  getBasedOn(ref: any) {
    this.basedonRef = ref;
  }

}
