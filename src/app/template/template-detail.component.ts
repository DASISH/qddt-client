import {Component, EventEmitter, OnInit, Output, OnChanges, SimpleChanges } from '@angular/core';
import { TemplateService } from './template.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MaterializeAction } from 'angular2-materialize';
import { Factory } from '../shared/classes/factory';
import { IDetailAction, IEntityEditAudit } from '../shared/classes/interfaces';
import { ActionKind, ElementKind } from '../shared/classes/enums';
import { HEADER_DETAILS } from '../shared/classes/constants';

const fileSaver = require('file-saver');

@Component({
  selector: 'qddt-template-detail',
  moduleId: module.id,
  templateUrl: './template-detail.component.html',
})

export class TemplateDetailComponent implements OnInit, OnChanges {
  @Output() closeState = new EventEmitter<IDetailAction>();
  @Output() selectedItem = new EventEmitter<IEntityEditAudit>();

  public item: IEntityEditAudit;
  public revisionIsVisible = false;
  public canDelete: boolean;
  public deleteAction = new EventEmitter<MaterializeAction>();

  private action: IDetailAction = { id: '', action: ActionKind.None, object: null };
  private kind: ElementKind;

  constructor(private service: TemplateService, private router: Router, private route: ActivatedRoute) {
    this.route.url.subscribe((event) => {
      const path = event[0].path;
      this.kind = HEADER_DETAILS.get(path).kind;
      this.canDelete = service.can(ActionKind.Delete, this.kind );
      this.item = Factory.createInstance(this.kind);
    });
  }

  ngOnInit() {
    if (this.kind) {
      this.service.getItemByKind(this.kind, this.route.snapshot.paramMap.get('id')).then(
        (item) => {
            this.action.id = item.id;
            this.item = item;
            if (this.selectedItem) { this.selectedItem.emit(item); } },
        (error) => { throw error; });
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  onHideDetail() {
    this.router.navigate(['../' ], { relativeTo: this.route });
    if (this.closeState) {
      this.closeState.emit(this.action);
    }
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

}

