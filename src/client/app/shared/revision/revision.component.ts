import { Component, Input, OnInit, OnChanges, EventEmitter, Output } from '@angular/core';
import { RevisionService } from './revision.service';

@Component({
  selector: 'qddt-revision',
  moduleId: module.id,
  templateUrl: './revision.component.html',
  providers: [RevisionService]
})
export class RevisionComponent implements OnChanges, OnInit {

  @Input() qddtURI: string;
  @Input() config: any[];
  @Input() current: any;
  @Output() requestPreview: EventEmitter<any> = new EventEmitter<any>();

  @Input() isVisible = false;

  private revisions: any[];
  private page: any;
  private selectRevisionId: number;
  private currentRevisionId: number;
  private showProgressBar= false;

  constructor(private service: RevisionService) {
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
    console.log('revision on changes ' + this.isVisible);
    if (this.isVisible) {
      this.getRevisionsById();
    } else {
      this.selectRevisionId = -1;
    }
    // this.init();
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
        (error)=> {
        this.showProgressBar = false;
        throw error;
      });
  }

  onSelectRevision(id: number) {
    this.selectRevisionId = id;
  }

  onPreviewRevision(id: number) {
    this.requestPreview.emit(this.revisions[id].entity);
  }

}
