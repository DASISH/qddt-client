import { Component, Input, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { PublicationStatus, PublicationService, ElementTypes } from './publication.service';
import { Subject } from 'rxjs/Subject';
import { Observable }     from 'rxjs/Observable';
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
  actions = new EventEmitter<string>();
  children: any[];
  questionItemActions = new EventEmitter<string>();
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
    if(this.elementType === 2) {
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
      });
  }

  onClickQuestionItem(questionItem) {
    this.questionItem = questionItem;
    this.questionItemActions.emit('openModal');
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
    this.actions.emit('openModal');
  }

}
