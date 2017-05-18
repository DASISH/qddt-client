import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { ControlConstructService, ControlConstruct } from './controlconstruct.service';
import { Observable }     from 'rxjs/Observable';

let fileSaver = require('./filesaver');

@Component({
  selector: 'qddt-control-construct-form',
  moduleId: module.id,
  template: `
  <div *ngIf="controlConstruct">
    <form (ngSubmit)="onSaveControlConstruct()" #qcform="ngForm">
      <div class="row nomargin">
        <div class="input-field">
          <label [attr.for]="controlConstruct.id + '-name'"
            class="active teal-text">Name
          </label>
          <textarea [attr.id]="controlConstruct.id + '-name'"
            name="{{controlConstruct.id}}-name" class="materialize-textarea"
            [(ngModel)]="controlConstruct.name" [attr.maxlength]="255"
            required>
          </textarea>
        </div>
      </div>
      <div class="nomargin">
        <ul class="hoverable"
          (mouseenter)="showPreinstructionButton = !readonly"
          (mouseleave)="showPreinstructionButton = false">
          <li>
            <div class="row">
              <div class="col s11"><label class="teal-text">Pre Instructions</label></div>
              <div class="col s1">
                <a [ngClass]="{hide: !showPreinstructionButton}"
                  class="btn-flat btn-floating btn-small waves-effect waves-light teal"
                  (click)="createPreInstruction=!createPreInstruction">
                  <i class="material-icons">add</i>
                </a>
              </div>
            </div>
          </li>
          <li class="collection-item" *ngIf="createPreInstruction">
            <qddt-instruction-create (createInstructionEvent)="onAddPreInstruction($event)">
            </qddt-instruction-create>
          </li>
          <li class="collection-item" *ngFor="let instruction of controlConstruct.preInstructions; let idx=index">
            <div class="row"
              (mouseenter)="instruction.showbutton = !readonly"
              (mouseleave)="instruction.showbutton = false">
              <div class="col s11">{{instruction?.description}}</div>
              <div class="col s1">
              <a [ngClass]="{hide: !showPreinstructionButton}"
                class="modal-trigger btn-flat btn-floating btn-medium waves-effect waves-light teal"
                (click)="onDeletePreInstruction(idx)">
                <i class="material-icons">remove</i>
              </a>
              </div>                 
            </div>
          </li>
        </ul>
      </div>

      <div class="nomargin"
        (mouseenter)="showQuestionButton = !readonly"
        (mouseleave)="showQuestionButton = false">
        <div class="row">
          <div class="col s10"><label class="teal-text">Question Text</label></div>
          <div class="col s1">
            <a [ngClass]="{hide: !showQuestionButton}"
              class="btn-flat btn-floating btn-small waves-effect waves-light teal"
              (click)="editQuestoinItem = !editQuestoinItem;savedquestionitem=controlConstruct.questionItem;">
              <i *ngIf="controlConstruct.questionItem"class="material-icons">play_for_work</i>
              <i *ngIf="!controlConstruct.questionItem" class="material-icons">add</i>
            </a>
          </div>
          <div class="col s1">
            <a [ngClass]="{hide: !showQuestionButton}"
              class="btn-flat btn-floating btn-small waves-effect waves-light teal"
              (click)="onRemoveQuestoinItem()">
              <i class="material-icons">remove</i>
            </a>
          </div>
        </div>
        <div class="row">
          <h5>{{controlConstruct?.questionItem?.question?.question}}</h5>
        </div>
        <qddt-control-construct-questionitem-select
          *ngIf="editQuestoinItem"
          (dismissEvent)="editQuestoinItem = false;controlConstruct.questionItem=savedquestionitem;"
          (useQuestionItemEvent) = "onUseQuestionItem($event)"
          [controlConstruct]="controlConstruct">
        </qddt-control-construct-questionitem-select>
      </div>
      <div class="nomargin">
        <ul class="hoverable"
          (mouseenter)="showPostinstructionButton = !readonly"
          (mouseleave)="showPostinstructionButton = false">
          <li>
            <div class="row">
              <div class="col s11"><label class="teal-text">Post Instructions</label></div>
              <div class="col s1">
                <a [ngClass]="{hide: !showPostinstructionButton}"
                  class="btn-flat btn-floating btn-small waves-effect waves-light teal"
                  (click)="createPostInstruction=!createPostInstruction">
                  <i class="material-icons">add</i>
                </a>
              </div>
            </div>
          </li>
          <li class="collection-item" *ngIf="createPostInstruction">
            <qddt-instruction-create (createInstructionEvent)="onAddPostInstruction($event)">
            </qddt-instruction-create>
          </li>
          <li class="collection-item" *ngFor="let instruction of controlConstruct.postInstructions; let idx=index">
            <div class="row"
              (mouseenter)="instruction.showbutton = !readonly"
              (mouseleave)="instruction.showbutton = false">
              <div class="col s11">{{instruction?.description}}</div>
              <div class="col s1">
              <a [ngClass]="{hide: !showPostinstructionButton}"
                class="modal-trigger btn-flat btn-floating btn-medium waves-effect waves-light teal"
                (click)="onDeletePostInstruction(idx)">
                <i class="material-icons">remove</i>
              </a>
              </div>                 
            </div>
          </li>
        </ul>
      </div>

      <qddt-responsedomain-preview
        *ngIf="controlConstruct.questionItem && controlConstruct.questionItem.responseDomain"
        [isVisible]="true" [responseDomain]="controlConstruct.questionItem.responseDomain">
      </qddt-responsedomain-preview>

      <div class="row card">
        <div class="row">
          <div class="col s6">
            <a class="waves-effect waves-light btn"
              (click)="showUploadFileForm=!showUploadFileForm">File Upload</a>
          </div>
        </div>
        <div class="row" *ngIf="showUploadFileForm && !readonly">
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
        <div class="row hoverable">
          <ul>
            <li *ngFor="let m of controlConstruct.otherMaterials; let idx=index;">
              <div class="row"
                (mouseenter)="m.showbutton = !readonly"
                (mouseleave)="m.showbutton = false">
                <div class="col s10">
                  <a class="waves-effect waves-light" (click)="onDownloadFile(m)">{{m.originalName}}</a>
                </div>
                <div class="col s2 right">
                  <a class="btn-flat btn-floating btn-medium waves-effect waves-light teal"
                    [ngClass]="{hide: !m.showbutton}"
                    (click)="onDeleteFile(idx)">
                    <i class="material-icons left medium">delete_forever</i>
                  </a>
                </div>
              </div>
            </li>
            <li *ngFor="let file of fileStore; let idx=index;">
              <div class="row"
                (mouseenter)="file.showbutton = !readonly"
                (mouseleave)="file.showbutton = false">
                <div class="col s10">
                  <a class="waves-effect waves-light">{{file[0]?.name}}</a>
                </div>
                <div class="col s2 right">
                  <a class="btn-flat btn-floating btn-medium waves-effect waves-light teal"
                    [ngClass]="{hide: !file.showbutton}"
                    (click)="onDeleteFileFromLocal(idx)">
                    <i class="material-icons left medium">delete_forever</i>
                  </a>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <div class="row">
        <qddt-revision-detail [element]="controlConstruct"
          (BasedonObjectDetail)="onBasedonObjectDetail($event)"
          [type]="'controlconstruct'">
        </qddt-revision-detail>
      </div>

      <div class="row" *ngIf="!readonly">
		    <qddt-rational [element]="controlConstruct"></qddt-rational>
      </div>
      <button *ngIf="!readonly" type="submit" class="btn btn-default">Submit</button>
    </form>
    <div class="modal modal-fixed-footer"
      materialize [materializeActions]="basedonActions">
      <div class="modal-content">
		    <h4>Basedon Object Detail</h4>
        <div class="row" *ngIf="basedonObject">
			    <qddt-control-construct-form
            [readonly]="true"
			      [controlConstruct]="basedonObject">
			    </qddt-control-construct-form>
        </div>
      </div>
      <div class="modal-footer">
        <button id="controlConstructs-modal-close"
          class="btn btn-default red modal-action modal-close waves-effect">
          <a><i class="close material-icons medium white-text">close</i></a>
        </button>
      </div>
    </div>
  </div>
  `,
  styles: [
    '.nomargin: { margin:0; }'
  ],
  providers: [ControlConstructService],
})

export class ControlConstructFormComponent implements OnInit {
  @Input() controlConstruct: ControlConstruct;
  @Input() isNew: boolean;
  @Input() readonly: boolean;
  @Output() elementEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output() exceptionEvent: EventEmitter<String> = new EventEmitter<String>();
  editQuestoinItem: boolean;
  createPostInstruction: boolean;
  createPreInstruction: boolean;
  basedonActions = new EventEmitter<string>();
  basedonObject: any;
  savedquestionitem: any;
  private revisionIsVisible: boolean;
  private selectedInstruction: any;
  private showUploadFileForm: boolean;
  private showUploadedFiles: boolean;
  private files: FileList;
  private fileStore: any[];
  private toDeleteFiles: any[];
  private savedObject: string;
  private showPreinstructionButton: any;
  private showPostinstructionButton: any;
  private showQuestionButton: any;

  constructor(private service: ControlConstructService) {
    this.revisionIsVisible = false;
    this.createPostInstruction = false;
    this.createPreInstruction = false;
    this.editQuestoinItem = false;
    this.showUploadFileForm = false;
    this.showUploadedFiles = false;
    this.fileStore = [];
    this.toDeleteFiles = [];
    this.showPreinstructionButton = false;
    this.showPostinstructionButton = false;
    this.showQuestionButton = false;
  }

  ngOnInit() {
    if(this.isNew === null || this.isNew === undefined) {
      this.isNew = false;
    }
    if(this.isNew) {
      this.controlConstruct.id = new Date().toString();
    }
    if(this.readonly === null || this.readonly === undefined) {
      this.readonly = false;
    }
  }

  onBasedonObjectDetail(id: string) {
    this.service.getControlConstruct(id)
      .subscribe(
      (result: any) => {
        this.basedonObject = result;
        this.basedonActions.emit('openModal');
      },
      (err: any) => null
      );
  }

  onDeletePreInstruction(id: number) {
    this.controlConstruct.preInstructions.splice(id, 1);
  }

  onAddPreInstruction(instruction: any) {
    this.controlConstruct.preInstructions.push(instruction);
    this.createPreInstruction = false;
  }

  onDeletePostInstruction(id: number) {
    this.controlConstruct.postInstructions.splice(id, 1);
  }

  onAddPostInstruction(instruction: any) {
    this.controlConstruct.postInstructions.push(instruction);
    this.createPostInstruction = false;
  }

  onUseQuestionItem() {
    this.editQuestoinItem = false;
  }

  onRemoveQuestoinItem() {
    this.controlConstruct.questionItem = null;
    this.editQuestoinItem = false;
  }

  onDownloadFile(o: any) {
    let fileType = o.fileType || 'text/plain';
    let fileName = o.originalName;
    let len = o.size;
    this.service.getFile(o.id).subscribe(
      (data: any) => {
        fileSaver(data, fileName);
      },
      error => this.popupModal(error));
  }

  onSelectFile(filename: any) {
    this.files = filename.target.files;
  }

  onDeleteFile(idx: number) {
    if(this.controlConstruct.otherMaterials
      && this.controlConstruct.otherMaterials.length > idx) {
      let items = this.controlConstruct.otherMaterials.splice(idx, 1);
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

  onSaveControlConstruct() {
    let controlConstruct = this.controlConstruct;
    let files = this.fileStore;
    let len = files.length;
    let source = Observable.of({});
    let toDeleteFiles = this.toDeleteFiles;
    if (len > 0 || this.toDeleteFiles.length > 0) {
      source = Observable.range(0, len + this.toDeleteFiles.length)
        .flatMap((x: any) => {
          if(x < len) {
            let file = files[x];
            return this.service.uploadFile(controlConstruct.id, file);
          } else {
            let file = toDeleteFiles[x - len];
            return this.service.deleteFile(file.id);
          }
        });
    }
    let index = 0;
    let service = this.service;
    let object = this.savedObject;
    let elementEvent = this.elementEvent;
    source.subscribe(
      function (x: any) {
        if (index < len && x.id !== undefined && x.id !== null) {
          controlConstruct['otherMaterials'].push(x);
          index = index + 1;
        }
      },
      function (error: any) {
        console.log('Error: %s', error);
      },
      function () {
        service.update(controlConstruct).subscribe((result: any) => {
          elementEvent.emit(result);
        }, (error: any) => {
          console.log('Error: %s', error);
        });
      });
  }

  private popupModal(error: any) {
    this.exceptionEvent.emit(error);
  }

}
