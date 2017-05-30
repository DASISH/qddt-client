import { Component, Input, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import {  PublicationService } from './publication.service';
import { Observable }     from 'rxjs/Observable';
import { MaterializeAction } from 'angular2-materialize';

let fileSaver = require('../controlconstruct/filesaver');

@Component({
  selector: 'qddt-publication-preview',
  moduleId: module.id,
  styles: [
    `:host /deep/ .row {
       margin-left: auto;
       margin-right: auto;
    }`
  ],
  templateUrl: './publication.preview.component.html',
  providers: [PublicationService],
})

export class PublicationPreviewComponent implements OnChanges {
  @Input() element: any;
  @Input() elementType: any;
  modalActions = new EventEmitter<string|MaterializeAction>();
  questionItemActions = new EventEmitter<string|MaterializeAction>();
  children: any[];
  questionItem: any;

  constructor(private service: PublicationService) {
  }

  ngOnChanges(changes: SimpleChanges) {
    if(this.elementType === 1
      && changes['element'] !== null
      && changes['element'] !== undefined) {
      this.children = [];
      this.service.getByTopic(this.element.id)
        .subscribe((result: any) => {
        this.children = result.content || [];
      }, (error: any) => {
        console.log(error);
      });
    }
    if(this.elementType === 2 && changes['element'] !== null
      && changes['element'] !== undefined) {
        console.log(this.element);
      this.loadQuestionitem();
    }
  }

  loadQuestionitem() {
    let conceptQuestionItems: any[] = this.element.conceptQuestionItems;
    let source = Observable.range(0, conceptQuestionItems.length)
      .concatMap((x: any) => {
        let id: string = conceptQuestionItems[x].id.questionItemId;
        return this.service.getQuestionitem(id);
      });

    let index = 0;
    let service = this.service;
    let questionItems: any[] = [];
    let element = this.element;

    source.subscribe(
      function (x: any) {
        if (index < conceptQuestionItems.length) {
          questionItems[index] = x;
          index = index + 1;
        }
      },
      function (err: any) {
        console.log('Error: %s', err);
      },
      function () {
        element.questionItems = questionItems;
        console.log(element);
      });
  }

  onClickQuestionItem(questionItem) {
    this.questionItem = questionItem;
    this.questionItemActions.emit({action:'modal', params:['open']});
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

  onQuestionitemDetail(e: any) {
    this.modalActions.emit({action:'modal', params:['open']});
  }

}
