import { Component, Input,  OnChanges } from '@angular/core';
import { RevisionService } from './revision.service';
import { QddtMessageService } from '../../core/global/message.service';
import { ElementKind, IElementRef } from '../elementinterfaces/elements';
import { DEFAULT_CONFIG, LIST_CONFIG } from './revision-config';
import { IEntityAudit } from '../elementinterfaces/entityaudit';

@Component({
  selector: 'qddt-revision',
  moduleId: module.id,
  styles: ['table { table-layout:auto;}'],
  templateUrl: './revision.component.html',
  providers: [RevisionService]
})
export class RevisionComponent implements OnChanges {
  @Input() current: IEntityAudit;

  public config: any;
  public revisions = [];
  public selectRevisionId: number;
  private showProgressBar = false;

  constructor(private service: RevisionService, private message: QddtMessageService) {
    this.selectRevisionId = -1;
  }

   ngOnChanges() {
    if (!this.config) {
      if (this.current['config']) {
        this.config = this.current['config'];
      } else {
        if (LIST_CONFIG.has(this.getElementKind())) {
          this.config = LIST_CONFIG.get(this.getElementKind());
        } else {
          this.config = DEFAULT_CONFIG;
        }
      }
    }
    this.getRevisionsById();
  }

  getRevisionsById() {
    this.showProgressBar = true;
    this.service.getRevisions(this.getElementKind(), this.current.id).then(
      (result: any) => {
        this.revisions = result.content;
        this.showProgressBar = false; },
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

  private getElementKind(): ElementKind {
    return ElementKind[this.current.classKind];
  }
}
