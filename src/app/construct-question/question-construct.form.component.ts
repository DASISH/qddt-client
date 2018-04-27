import { Component, Input, Output, EventEmitter,  OnChanges, SimpleChanges } from '@angular/core';
import { QuestionItem } from '../question/question.classes';
import { ElementKind } from '../shared/classes/enums';
import {ElementRevisionRef, Page} from '../shared/classes/classes';
import { QuestionConstruct } from './question-construct.classes';
import { Instruction, Universe } from '../controlconstruct/controlconstruct.classes';
import { TemplateService } from '../template/template.service';
import { IRevisionResult, IElement, IRevisionRef, IOtherMaterial } from '../shared/classes/interfaces';
import {forEach} from '@angular/router/src/utils/collection';
import { HttpResponse, HttpEventType, HttpEvent } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';

const filesaver = require('file-saver');

@Component({
  selector: 'qddt-question-construct-form',
  moduleId: module.id,
  templateUrl: 'question-construct.form.component.html',
  styles: [
    '.nomargin { margin:0; }',
    ':host /deep/ .hoverable .row { min-height:3rem; margin-bottom:0px;}'
  ],
})

export class QuestionConstructFormComponent   {
  @Input() controlConstruct: QuestionConstruct;
  @Input() readonly = false;
  @Output() modifiedEvent = new EventEmitter<QuestionConstruct>();

  public readonly UNIVERSE = ElementKind.UNIVERSE;
  public readonly INSTRUCTION = ElementKind.INSTRUCTION;
  public readonly QUESTION = ElementKind.QUESTION_ITEM;

  public readonly formId = Math.round( Math.random() * 10000);

  /* public savedQuestionItem: any; */
  public instructionList: Instruction[];
  public universeList: Universe[];
  public questionList: QuestionItem[];
  public revisionResults: IRevisionResult<QuestionItem>[];
  public fileProgress: number;

  public showUploadFileForm: boolean;
  public showProgressBar = false;

  private fileStore: File[] = [];
  private toDeleteFiles: IOtherMaterial[] = [];



  constructor(private service: TemplateService) {
    this.showUploadFileForm = false;
  }

  onAddUniverse(item: IElement) {
    this.controlConstruct.universe.push(item.element);
  }

  onAddPreInstruction(item: IElement) {
    this.controlConstruct.preInstructions.push(item.element);
  }

  onAddPostInstruction(item: IElement) {
    this.controlConstruct.postInstructions.push(item.element);
  }

  onInstructionSearch(key: string) {
    this.service.searchByKind<Instruction>( {kind: this.INSTRUCTION, key: key , page: new Page() }).then(
      (result) => {
        this.instructionList = result.content;
      });
  }

  onUniverseSearch(key: string) {
    this.service.searchByKind<Universe>(  {kind: this.UNIVERSE, key: key, page: new Page() }).then(
      (result) => {
        this.universeList = result.content;
      });
  }

  onQuestionSearch(key: IElement) {
    this.service.searchByKind<QuestionItem>( {kind: this.QUESTION, key: key.element, page: new Page() } ).then(
      (result) => {
        this.questionList = result.content;
      });
  }

  onRevisonSearch(item: IRevisionRef) {
    this.service.getRevisionsByKind<QuestionItem>(this.QUESTION, item.elementId ).then(
      (result) => {
        this.revisionResults = result.content;
      });

  }

  onRevisionSelect(ref: ElementRevisionRef ) {
    this.controlConstruct.questionItem = ref.element;
    this.controlConstruct.questionItemRevision = ref.elementRevision;
    this.questionList = [];
    this.revisionResults = [];
  }

  onRemoveQuestoinItem() {
    this.controlConstruct.questionItem = null;
  }

  onDownloadFile(o: IOtherMaterial) {
    const fileName = o.originalName;
    this.service.getFile(o.id).then(
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
    if (this.controlConstruct.otherMaterials
      && this.controlConstruct.otherMaterials.length > idx) {
      const items = this.controlConstruct.otherMaterials.splice(idx, 1);
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



  onSaveForm() {

    const formData: FormData = new FormData();
    const qc = this.controlConstruct;
    formData.append('controlconstruct', JSON.stringify(qc));
    this.fileStore.forEach( (file) => { formData.append('files', file); });

    this.service.updateWithfiles(ElementKind.QUESTION_CONSTRUCT, formData).subscribe(
      (result) => {
        // if (result.type === HttpEventType.UploadProgress) {
        //   // This is an upload progress event. Compute and show the % done:
        //   const percentDone = Math.round(100 * result.loaded / result.total);
        //   console.log(`File is ${percentDone}% uploaded.`);
        // } else {
            this.controlConstruct = result;
            this.deleteFiles();
            this.modifiedEvent.emit(result);
        // }
      }, (error) => { throw error; });


    // .pipe(
    //   map(event => this.getEventMessage(event, file)),
    //   tap(message => this.showProgress(message)),
    //   last(), // return last (completed) message to caller
    //   catchError(this.handleError(file))
    // );
  }

  // private getEventMessage(event: HttpEvent<any>, file: File) {
  //   switch (event.type) {
  //     case HttpEventType.Sent:
  //       return `Uploading file "${file.name}" of size ${file.size}.`;

  //     case HttpEventType.UploadProgress:
  //       // Compute and show the % done:
  //       const percentDone = Math.round(100 * event.loaded / event.total);
  //       return `File "${file.name}" is ${percentDone}% uploaded.`;

  //     case HttpEventType.Response:
  //       return `File "${file.name}" was completely uploaded!`;

  //       default:
  //       return `File "${file.name}" surprising upload event: ${event.type}.`;
  //   }
  // }

private async deleteFiles() {
  this.toDeleteFiles.forEach(async (o) => {
     const response = await this.service.deleteFile(o.id).toPromise();
  });
  return true;
}

  // onSaveQuestionConstruct() {
  //   const controlConstruct = this.controlConstruct;
  //   const files = this.fileStore;
  //   const len = files.length;
  //   let source = Observable.of({});
  //   const toDeleteFiles = this.toDeleteFiles;
  //   if (len > 0 || this.toDeleteFiles.length > 0) {
  //     source = Observable.range(0, len + this.toDeleteFiles.length)
  //       .flatMap((x: any) => {
  //         if (x < len) {
  //           const file = files[x];
  //           return this.service.uploadFile(controlConstruct.id, '/CC', file);
  //         } else {
  //           const file = toDeleteFiles[x - len];
  //           return this.service.deleteFile(file.id);
  //         }
  //       });
  //   }
  //   const service = this.service;
  //   const elementEvent = this.modifiedEvent;
  //   source.subscribe(
  //     function () {
  //       service.update(controlConstruct).subscribe(
  //         (result) => {
  //           this.controlConstruct = result;
  //           elementEvent.emit(result); },
  //         (error: any) => {
  //         throw error;
  //       });
  //     },
  //     function (error: any) {
  //       throw error;
  //     });
  // }


}
