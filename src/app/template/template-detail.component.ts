import {Component, EventEmitter, OnInit, Output, OnChanges, SimpleChanges, OnDestroy, AfterContentChecked} from '@angular/core';
import { TemplateService } from './template.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MaterializeAction } from 'angular2-materialize';
import { Factory } from '../shared/classes/factory';
import { IDetailAction, IEntityEditAudit } from '../shared/classes/interfaces';
import { ActionKind, ElementKind } from '../shared/classes/enums';
import { HEADER_DETAILS } from '../shared/classes/constants';

declare var Materialize: any;

const fileSaver = require('file-saver');

@Component({
  selector: 'qddt-template-detail',
  moduleId: module.id,
  templateUrl: './template-detail.component.html',
})

export class TemplateDetailComponent implements OnInit, OnDestroy, AfterContentChecked {
  @Output() closeState = new EventEmitter<IDetailAction>();
  @Output() selectedItem = new EventEmitter<IEntityEditAudit>();

  public item: IEntityEditAudit;
  public revisionIsVisible = false;
  public canDelete: boolean;
  public deleteAction = new EventEmitter<MaterializeAction>();
  public showProgressBar = true;

  private action: IDetailAction = { id: '', action: ActionKind.None, object: null };
  private kind: ElementKind;
  private alive = true;
  private refreshCount = 0;

  constructor(private service: TemplateService, private router: Router, private route: ActivatedRoute) {
    this.route.url
      .takeWhile(() => this.alive)
      .subscribe((event) => {
        const path = event[0].path;
        this.kind = HEADER_DETAILS.get(path).kind;
        this.canDelete = service.can(ActionKind.Delete, this.kind );
        console.log('can delete ' + this.canDelete);
        this.item = Factory.createInstance(this.kind);
      });
  }

  ngOnInit() {
    this.refreshCount = 0;
    if (this.kind) {
      this.showProgressBar = true;
      this.service.getItemByKind(this.kind, this.route.snapshot.paramMap.get('id')).then(
        (item) => {
            this.action.id = item.id;
            this.item = item;
            this.showProgressBar = false;
            this.selectedItem.emit(item); },
        (error) => { this.showProgressBar = false; throw error; });
    }
  }

  ngAfterContentChecked(): void {
    if (this.refreshCount < 10) {
      try {
        this.refreshCount++;
        Materialize.updateTextFields();
      } catch (Exception) {
      }
    }
  }

  onHideDetail() {
    this.router.navigate(['../' ], { relativeTo: this.route });
    this.closeState.emit(this.action);
  }

  onDeleteConfirmModal() {
    this.deleteAction.emit({action: 'modal', params: ['open']});
  }

  onConfirmDeleting() {
    this.service.delete(this.item)
      .subscribe(() => {
        this.action.action = ActionKind.Delete;
        this.onHideDetail();
      });
  }

  onItemSaved(item: IEntityEditAudit) {
    this.action.action = ActionKind.Update;
    this.action.object = item;
    this.onHideDetail();
  }

  onGetPdf( item: IEntityEditAudit) {
    this.service.getPdf(item).then(
      (data) => { fileSaver.saveAs(data, item.name + '.pdf'); },
      (error) => { throw error; });
  }

  ngOnDestroy(): void {
    this.alive = false;
  }

}

