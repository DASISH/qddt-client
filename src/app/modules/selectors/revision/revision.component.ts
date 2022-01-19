import { Component, OnChanges, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import {
  getElementKind,
  IEntityEditAudit,
  IRevisionRef,
  ISelectOption,
  SelectItem,
  TemplateService,
  hasChanges
} from '../../../lib';


@Component({
  selector: 'qddt-revision-select',
  templateUrl: './revision.component.html',
})

export class RevisionComponent implements OnChanges {
  @Input() revisionRef: IRevisionRef;
  @Output() selectEvent = new EventEmitter<IEntityEditAudit>();
  @Output() dismissEvent = new EventEmitter<boolean>();

  public revisionResultEntities: IEntityEditAudit[];
  public selectedRevisionResult: IEntityEditAudit;
  public revisionlockups: ISelectOption[];
  public showProgressBar = false;
  public showPickRevision = false;
  // eslint-disable-next-line @typescript-eslint/naming-convention, no-underscore-dangle, id-blacklist, id-match
  private _revisionIndex: number;

  constructor(private service: TemplateService) { }

  // used as index for select comp
  get selectedRevision() {
    return this._revisionIndex;
  }
  set selectedRevision(value) {
    this._revisionIndex = +value;
    if (this._revisionIndex <= 1) {
      this.selectedRevisionResult = null;
    } else {
      this.selectedRevisionResult = this.revisionResultEntities.find(entity => entity.version.rev === this._revisionIndex);
    }
    // console.debug(this._selectedRevision + ' -> ' +  this.selectedRevisionResult || JSON);
  }

  public version(item: IEntityEditAudit) {
    return item.version.major + '.' + item.version.minor + ((item.version.versionLabel) ? ' latest version' : '');
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (hasChanges(changes.revisionRef)) {

      const ref = changes.revisionRef.currentValue as IRevisionRef;
      this.showProgressBar = true;

      this.service.getByKindRevisions(getElementKind(ref.elementKind), ref.elementId).then(
        (result) => {
          this.revisionResultEntities = result.sort((e1: any, e2: any) => e2.version.rev - e1.version.rev);
          this.selectedRevision = ref.elementRevision;
          this.revisionlockups = this.revisionResultEntities.map(entity => new SelectItem({
            id: entity.version.rev,
            label: this.version(entity)
          }));
          this.showPickRevision = true;
          this.showProgressBar = false;
        },
        () => this.showProgressBar = false);
    } else {
      // console.debug(changes.toString());
    }
  }

  public onSelectRevision() {
    this.selectEvent.emit(this.selectedRevisionResult);
    this.revisionRef = null;
  }

  public onDismiss() {
    this.showPickRevision = false;
    this.selectedRevision = 0;
    this.dismissEvent.emit(true);
    this.revisionRef = null;
  }

}
