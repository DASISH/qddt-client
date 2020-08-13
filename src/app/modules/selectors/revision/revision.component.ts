import { Component, OnChanges, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import {
  getElementKind,
  IEntityEditAudit,
  IRevisionRef,
  IRevisionResultEntity,
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
  @Output() selectEvent = new EventEmitter<IRevisionResultEntity>();
  @Output() dismissEvent = new EventEmitter<boolean>();

  public revisionResultEntities: IRevisionResultEntity[];
  public selectedRevisionResult: IRevisionResultEntity;
  public revisionlockups: ISelectOption[];
  public showProgressBar = false;
  public showPickRevision = false;
  // tslint:disable-next-line:variable-name
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
      this.selectedRevisionResult = this.revisionResultEntities.find(entity => entity.revisionNumber === this._revisionIndex);
    }
    // console.log(this._selectedRevision + ' -> ' +  this.selectedRevisionResult || JSON);
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
          this.revisionResultEntities = result.content.sort((e1: any, e2: any) => e2.revisionNumber - e1.revisionNumber);
          this.selectedRevision = ref.elementRevision;
          this.revisionlockups = this.revisionResultEntities.map(rev => new SelectItem({
            id: rev.revisionNumber,
            label: this.version(rev.entity)
          }));
          this.showPickRevision = true;
          this.showProgressBar = false;
        },
        () => this.showProgressBar = false);
    } else {
      // console.log(changes.toString());
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
