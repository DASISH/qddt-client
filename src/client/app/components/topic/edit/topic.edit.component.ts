import { Component, Input, EventEmitter } from '@angular/core';

import { TopicService, Topic } from '../topic.service';
import { Observable }     from 'rxjs/Observable';

let fileSaver = require('../../controlconstruct/filesaver');

@Component({
  selector: 'qddt-topic-edit',
  moduleId: module.id,
  providers: [TopicService],
  template: `
  <div *ngIf="isVisible">
    <div *ngIf="topic" class="card" id="{{topic.id}}"  >
      <form (ngSubmit)="onSave()" #hf="ngForm">
        <div class="row">
          <div class="col s12">
            <label [attr.for]="topic.id + '-name'" class="active teal-text">Name</label>          
            <input id="{{topic?.id}}-name"
              name="{{topic?.id}}-name"type="text" [(ngModel)]="topic.name" required>
          </div>
        </div>
        <div class="row">
          <div class="col s12">
            <label [attr.for]="topic.id + '-description'" class="active teal-text">Description</label>            
            <textarea id="{{topic?.id}}-description" name="{{topic?.id}}-description"
              class="materialize-textarea"  [(ngModel)]="topic.abstractDescription" required></textarea>
          </div>
        </div>
        <div class="row card">
          <div class="row">
            <div class="col s6">
              <a class="waves-effect waves-light btn"
                (click)="showUploadFileForm=!showUploadFileForm">File Upload</a>
            </div>
          </div>
          <div class="row" *ngIf="showUploadFileForm">
            <div class="file-field input-field">
              <div class="btn">
                <span>File</span>
                <input type="file" (change)="onSelectFile($event)">
              </div>
              <div class="file-path-wrapper">
                <input class="file-path validate" type="text" placeholder="Upload one file">
              </div>
            </div>
            <a *ngIf="files" class="btn-flat right btn-floating btn-medium waves-effect waves-light teal"
              (click)="onUploadFile()">
              <i class="material-icons left medium">done</i>
            </a>
          </div>
          <div class="row card">
            <ul>
              <li *ngFor="let m of topic.otherMaterials; let idx=index;" class="row">
                <div class="col s10">
                  <a class="waves-effect waves-light" (click)="onDownloadFile(m)">{{m.originalName}}</a>
                </div>
                <div class="col s2 right">
                  <a class="btn-flat btn-floating btn-medium waves-effect waves-light teal"
                    (click)="onDeleteFile(idx)">
                    <i class="material-icons left medium">delete_forever</i>
                  </a>
                </div>
              </li>
              <li *ngFor="let file of fileStore; let idx=index;" class="row">
                <div class="col s10">
                  <a class="waves-effect waves-light">{{file[0]?.name}}</a>
                </div>
                <div class="col s2 right">
                  <a class="btn-flat btn-floating btn-medium waves-effect waves-light teal"
                    (click)="onDeleteFileFromLocal(idx)">
                    <i class="material-icons left medium">delete_forever</i>
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div class="row">
          <qddt-revision-detail [element]="topic" [type]="'topic'"></qddt-revision-detail>
        </div>
        <div class="row">
          <qddt-rational [element]="topic"></qddt-rational>
        </div>
        <button type="submit" class="btn btn-default">Submit</button>
      </form>
    </div>
  </div>
  <div class="modal"
  materialize [materializeActions]="actions">
  <div class="modal-content">
    <div class="row">
      <h4>An error occured</h4>
      <span *ngFor="let error of errors">{{error}}</span>
    </div>
  </div>
  <div class="modal-footer">
    <button id="controlConstructs-modal-close"
      class="btn btn-default red modal-action modal-close waves-effect">
      <a><i class="close material-icons medium white-text">close</i></a>
    </button>
  </div>
</div>
`
})

export class TopicEditComponent {

  @Input() topic: Topic;
  @Input() isVisible: boolean;
  errors: string[];
  actions = new EventEmitter<string>();
  private showUploadFileForm: boolean;
  private showUploadedFiles: boolean;
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
    let fileType = o.fileType || 'text/plain';
    let fileName = o.originalName;
    let len = o.size;
    this.service.getFile(o.id).subscribe(
      (data: any) => {
        fileSaver(data, fileName);
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
    let actions = this.actions;
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
        actions.emit('openModal');
      },
      function () {
        service.edit(topic).subscribe((result: any) => {
          this.topic = result;
        }, (error: any) => {
          errors.push(error);
          actions.emit('openModal');
        });
      });
  }

}
