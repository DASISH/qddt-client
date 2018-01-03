import { Component, Input, EventEmitter, Output } from '@angular/core';
import { TopicService, Topic } from './topic.service';
import { Observable }     from 'rxjs/Observable';
import { MaterializeAction } from 'angular2-materialize';
let saveAs = require('file-saver');

@Component({
  selector: 'qddt-topic-edit',
  moduleId: module.id,
  styles: [
    '.nomargin { margin:0; }',
    ':host /deep/ .hoverable { margin-bottom:0px;}',
    ':host /deep/ .hoverable .row { min-height:3rem; margin-bottom:0px;}'
  ],
  providers: [TopicService],
  templateUrl: 'topic.edit.component.html'
})

export class TopicEditComponent  {

  @Input() topic: Topic;
  @Input() isVisible: boolean;
  @Output() topicSavedAction = new EventEmitter<any>();
  errors: string[];
  showErrorActions = new EventEmitter<MaterializeAction>();
  private showUploadFileForm: boolean;
  private showUploadedFiles: boolean;
  private showDeletebutton: boolean= false;
  private showbutton: boolean= false;
  private readonly: boolean= false;
  private files: FileList;
  private fileStore: any[];
  private toDeleteFiles: any[];

  constructor(private service: TopicService) {
    this.showUploadFileForm = false;
    this.showUploadedFiles = false;
    this.fileStore = [];
    this.toDeleteFiles = [];
    this.errors = [];
  }


  onDownloadFile(o: any) {
    let fileName = o.originalName;
    this.service.getFile(o.id).subscribe(
      (data: any) => {
        saveAs(data, fileName);
      },
      error => console.log(error));
  }

  onSelectFile(filename: any) {
    this.files = filename.target.files;
  }

  onDeleteFile(idx: number) {
    if(this.topic.otherMaterials
      && this.topic.otherMaterials.length > idx) {
      let items = this.topic.otherMaterials.splice(idx, 1);
      if(items.length > 0) {
        this.toDeleteFiles.push(items[0]);
      }
    }
  }

  onDeleteFileFromLocal(idx: number) {
    if(this.fileStore && this.fileStore.length > idx) {
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
    let topic = this.topic;
    let files = this.fileStore;
    let len = files.length;
    let source = Observable.of({});
    let toDeleteFiles = this.toDeleteFiles;
    if (len > 0 || toDeleteFiles.length > 0) {
      source = Observable.range(0, len + toDeleteFiles.length)
        .flatMap((x: any) => {
          if(x < len) {
            let file = files[x];
            return this.service.uploadFile(topic.id, file);
          } else {
            let file = toDeleteFiles[x - len];
            return this.service.deleteFile(file.id);
          }
        });
    }
    let index = 0;
    let service = this.service;
    let actions = this.showErrorActions;
    let saveAction = this.topicSavedAction;
    let errors = this.errors;
    source.subscribe(
      function (x: any) {
        if (index < len && x.id !== undefined && x.id !== null) {
          topic['otherMaterials'].push(x);
          index = index + 1;
        }
      },
      function (error: any) {
        errors.push(error);
        actions.emit({action:'modal', params:['open']});
      },
      function () {
        service.edit(topic).subscribe((result: any) => {
          this.topic = result;
          saveAction.emit(result);
        }, (error: any) => {
          errors.push(error);
          actions.emit({action:'modal', params:['open']});
        });
      });
  }

}
