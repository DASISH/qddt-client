import { Component, Input, OnChanges } from '@angular/core';
import { RevisionService } from './revision.service';
import { DEFAULT_CONFIG, LIST_CONFIG, RevisionConfig } from './revision-config';
import { DomainKind, ElementKind, IElement, IEntityAudit, IEntityEditAudit, MessageService, ResponseDomain } from '../../lib';


@Component({
  selector: 'qddt-revision',

  styles: ['table { table-layout:auto;}'],
  templateUrl: './revision.component.html',
  providers: [RevisionService]
})
export class RevisionComponent implements OnChanges {
  @Input() current: IEntityEditAudit;

  public config: RevisionConfig[];
  public revisions = [];
  public selectRevisionId: number;
  public showProgressBar = false;

  constructor(private service: RevisionService, private message: MessageService) {
    this.selectRevisionId = -1;
  }

  ngOnChanges() {
    if (!this.config) {
      if (LIST_CONFIG.has(this.getElementKind())) {

        this.config = LIST_CONFIG.get(this.getElementKind());

      } else if (this.getElementKind() === ElementKind.RESPONSEDOMAIN) {

        this.config = this.getResponseDomainConfig();

      } else {

        this.config = DEFAULT_CONFIG;
      }
    }
    this.getRevisionsById();
  }

  getRevisionsById() {
    this.showProgressBar = true;
    this.service.getRevisions(this.getElementKind(), this.current.id).then(
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
    const ref: IElement = { element: this.revisions[id].entity, elementKind: this.revisions[id].entity.classKind };
    this.message.sendMessage(ref);
  }

  private getElementKind(): ElementKind {
    return ElementKind[this.current.classKind];
  }

  private isResponseDomain(element: IEntityAudit): element is ResponseDomain { // magic happens here
    return (element as ResponseDomain).responseKind !== undefined;
  }
  private getResponseKind(): DomainKind {
    if (this.isResponseDomain(this.current)) {
      return DomainKind[this.current.responseKind];
    }
    return DomainKind.NONE;
  }

  private getChildrenSize(): number {
    if (this.isResponseDomain(this.current)) {
      return this.current.managedRepresentation.children.length;
    }
    return 0;
  }

  private getResponseDomainConfig(): RevisionConfig[] {
    const config: RevisionConfig[] = [];
    if (this.getResponseKind() === DomainKind.SCALE) {
      config.push({ name: ['managedRepresentation', 'inputLimit', 'minimum'], label: 'Start' });
      config.push({ name: ['managedRepresentation', 'inputLimit', 'maximum'], label: 'End' });
      config.push({ name: ['managedRepresentation', 'inputLimit', 'step'], label: 'Range' });
      config.push({ name: 'displayLayout', label: 'display Layout' });
      const size = this.getChildrenSize();
      for (let i = 0; i < size; i++) {
        config.push({ name: ['managedRepresentation', 'children', i, 'label'], label: 'Cat-' + i });
        config.push({ name: ['managedRepresentation', 'children', i, 'code', 'value'], label: 'Anchor-' + i });
      }
    } else if (this.getResponseKind() === DomainKind.LIST) {
      config.push({ name: ['responseCardinality', 'minimum'], label: 'Cardinal-0' });
      config.push({ name: ['responseCardinality', 'maximum'], label: 'Cardinal-1' });
      const size = this.getChildrenSize();
      for (let i = 0; i < size; i++) {
        config.push({ name: ['managedRepresentation', 'children', i, 'label'], label: 'Cat-' + i });
        config.push({ name: ['managedRepresentation', 'children', i, 'code', 'value'], label: 'Code-' + i });
      }
    } else if (this.getResponseKind() === DomainKind.NUMERIC) {
      config.push({ name: ['managedRepresentation', 'inputLimit', 'minimum'], label: 'Low' });
      config.push({ name: ['managedRepresentation', 'inputLimit', 'maximum'], label: 'High' });
      config.push({ name: ['managedRepresentation', 'inputLimit', 'step'], label: 'Scale' });
      config.push({ name: ['managedRepresentation', 'format'], label: 'Format' });
    } else if (this.getResponseKind() === DomainKind.DATETIME) {
      config.push({ name: ['managedRepresentation', 'inputLimit', 'minimum'], label: 'After' });
      config.push({ name: ['managedRepresentation', 'inputLimit', 'maximum'], label: 'Before' });
      config.push({ name: ['managedRepresentation', 'format'], label: 'Date format' });
    } else if (this.getResponseKind() === DomainKind.TEXT) {
      config.push({ name: ['managedRepresentation', 'inputLimit', 'minimum'], label: 'Min Length' });
      config.push({ name: ['managedRepresentation', 'inputLimit', 'maximum'], label: 'Max Length' });
    }
    return DEFAULT_CONFIG.concat(config);
  }

}
