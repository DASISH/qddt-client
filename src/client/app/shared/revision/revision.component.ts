import { Component, Input, OnInit, OnChanges, EventEmitter, Output } from '@angular/core';
import { RevisionService } from './revision.service';
// import { MaterializeAction } from 'angular2-materialize';
// import { PreviewPublicationComponent } from '../../common/preview/preview.component';

@Component({
  selector: 'qddt-revision',
  moduleId: module.id,
  templateUrl: './revision.component.html',
  providers: [RevisionService]
})
export class RevisionComponent implements OnChanges, OnInit {

  @Input() qddtURI: string;
  @Input() isVisible: boolean;
  @Input() config: any[];
  @Input() current: any;
  @Output() requestPreview: EventEmitter<any> = new EventEmitter<any>();
  private revisions: any[];
  private page: any;
  private selectRevisionId: number;
  private currentRevisionId: number;
  private showProgressBar: boolean=false;



  constructor(private service: RevisionService) {
    this.revisions = [];
    this.currentRevisionId = -1;
    this.selectRevisionId = -1;
  }

  ngOnInit() {
    if(!this.config) {
      this.config = [{'name':'label','label':'Label'},{'name':'description','label':'Description'}];
    }
    if(!this.page) {
      this.page =  {number:1, size:10};
    }
  }

  ngOnChanges() {
    if (this.isVisible) {
      this.getRevisionsById();
    } else {
      this.selectRevisionId = -1;
    }
  }



  getRevisionsById() {
    this.showProgressBar= true;
    // let params = allRevisions.checked?'':'&ignorechangekinds="" ';
    this.service.getAllRevisions(this.qddtURI)
      .subscribe(
      (result: any) => {
        this.revisions = result.content;
        this.showProgressBar= false;
      },
      (err: any) => console.log('Unable to get all revisions')
      );
  }

  onSelectRevision(id: number) {
    this.selectRevisionId = id;
  }

  onPreviewRevision(id: number) {
    this.requestPreview.emit(this.revisions[id].entity);
  }

}
