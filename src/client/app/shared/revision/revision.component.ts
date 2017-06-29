import { Component, Input, OnInit, OnChanges, EventEmitter, Output } from '@angular/core';
import { RevisionService } from './revision.service';
import { MaterializeAction } from 'angular2-materialize';
// import { PreviewComponent } from '../../common/preview/preview.component';

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
  @Input() elementType: String;
  @Output() requestPreview: EventEmitter<any> = new EventEmitter<any>();
  private revisions: any[];
  private _revisions: any[];
  private page: any;
  private selectRevisionId: number;
  private currentRevisionId: number;
  private includeRevisions: boolean;
  private previewModalActions = new EventEmitter<string|MaterializeAction>();
  private selectedElement: any;


  constructor(private service: RevisionService) {
    this.revisions = [];
    this._revisions = [];
    this.currentRevisionId = -1;
    this.selectRevisionId = -1;
    this.includeRevisions = false;
  }

  ngOnInit() {
    if(this.config === null || this.config === undefined) {
      this.config = [{'name':'label','label':'Label'},{'name':'description','label':'Description'}];
    }
    if(this.page === null || this.page === undefined) {
      this.page =  {number:1, size:10};
    }
  }

  ngOnChanges() {
    if (this.isVisible) {
      this.getRevisionsById();
    } else {
      this.selectRevisionId = -1;
    }
    // this.init();
  }

  getRevisionsById() {
    this.service.getAllRevisions(this.qddtURI)
      .subscribe(
      (revisions: any) => {
        this._revisions = revisions.content;
        this.filterRevisions();
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

  // get diagnostic() { return JSON.stringify(this.revisions);}

  private filterRevisions() {
    if (!this.includeRevisions) {
      this.revisions = this._revisions.filter((e: any) => e.entity.changeKind !== 'IN_DEVELOPMENT');
    } else {
      this.revisions = this._revisions;
    }
  }

  // private init() {
  //   this.rows = [];
  //   this.items.forEach((item: any) => {
  //     var date: Date = new Date();
  //     if (item.modified !== undefined && item.modified.length > 2) {
  //       date.setUTCFullYear(item.modified[0], item.modified[1] - 1, item.modified[2]);
  //     }
  //     let version = '';
  //     if (item.version !== null && item.version !== undefined) {
  //       version = item.version.major + '.' + item.version.minor;
  //     }
  //     let name = '';
  //     if (item.agency !== null && item.agency !== undefined) {
  //       name = item.agency.name;
  //     }
  //     let row: any = {
  //       'id': item.id,
  //       'Version': version,
  //       'Agency': name,
  //       'Modified': date.toDateString(),
  //       'Object': item,
  //     };
  //     if(this.columns === null || this.columns === undefined) {
  //       this.columns = [];
  //     }
  //     this.columns.forEach((column: any) => {
  //       if (row[column.label] === undefined) {
  //         if (column.name instanceof Array) {
  //           let result: any = item;
  //           column.name.forEach((element: any) => {
  //             if (result !== null && result[element] !== undefined) {
  //               result = result[element];
  //             } else {
  //               result = '';
  //             }
  //           });
  //           row[column.label] = result;
  //         } else {
  //           row[column.label] = item[column.name];
  //         }
  //       }
  //     });
  //     this.rows.push(row);
  //     ['Modified', 'Version', 'Agency'].forEach((item: any) => {
  //       let column = this.columns.find((column: any) => column.label === item);
  //       if (!column) {
  //         this.columns.push({ 'name': item, 'label': item, 'sortable': false });
  //       }
  //     });
  //   });
  //   this._rows = this.rows;
  // }
}
