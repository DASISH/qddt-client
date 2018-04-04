import { Component, Input, OnInit, OnChanges, EventEmitter, Output } from '@angular/core';
import { RevisionService } from './revision.service';
import { QddtMessageService } from '../../core/global/message.service';
import { IElementRef } from '../elementinterfaces/elements';

@Component({
  selector: 'qddt-revision',
  moduleId: module.id,
  styles: ['table { table-layout:auto;}'],
  templateUrl: './revision.component.html',
  providers: [RevisionService]
})
export class RevisionComponent implements OnChanges, OnInit {

  @Input() qddtURI: string;
  @Input() config: any[];
  @Input() current: any;

  public revisions: any[];
  private page: any;
  private selectRevisionId: number;
  private currentRevisionId: number;
  private showProgressBar = false;

  constructor(private service: RevisionService, private message: QddtMessageService) {
    this.revisions = [];
    this.currentRevisionId = -1;
    this.selectRevisionId = -1;
  }

  ngOnInit() {
    if (!this.config) {
      this.config = [{'name': 'label', 'label': 'Label'}, {'name': 'description', 'label': 'Description'}];
    }
    if (!this.page) {
      this.page =  {number: 1, size: 10};
    }
  }

  ngOnChanges() {
    this.getRevisionsById();
  }



  getRevisionsById() {
    this.showProgressBar = true;
    // let params = allRevisions.checked?'':'&ignorechangekinds="" ';
    this.service.getAllRevisions(this.qddtURI)
      .then(
      (result: any) => {
        this.revisions = result.content;
        this.showProgressBar = false;
      },
        (error) => {
        this.showProgressBar = false;
        throw error;
      });
  }

  onSelectRevision(id: number) {
    this.selectRevisionId = id;
  }

  onPreviewRevision(id: number) {
    const  ref: IElementRef =  { element: this.revisions[id].entity, elementKind: this.revisions[id].entity.classKind };
    this.message.sendMessage( ref );
  }

}
