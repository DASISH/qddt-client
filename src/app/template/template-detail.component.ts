import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import { IEntityEditAudit } from '../shared/elementinterfaces/entityaudit';
import { TemplateService } from './template.service';
import { Action, IDetailAction } from '../shared/elementinterfaces/detailaction';
import { ActivatedRoute, Router } from '@angular/router';
import { MaterializeAction } from 'angular2-materialize';
import { HEADER_DETAILS } from '../shared/elementinterfaces/headerdetail';
import { ElementKind } from '../shared/elementinterfaces/elements';

const fileSaver = require('file-saver');

@Component({
  selector: 'qddt-template-detail',
  moduleId: module.id,
  templateUrl: './template-detail.component.html',
})

export class TemplateDetailComponent implements OnInit {
  @Output() closeState: EventEmitter<IDetailAction>;
  @Output() selectedItem: EventEmitter<IEntityEditAudit>;

  public item: IEntityEditAudit;
  public revisionIsVisible = false;
  public canDelete: boolean;
  public deleteAction = new EventEmitter<MaterializeAction>();

  public config: any[];
  private action: IDetailAction = { id: '', action: Action.None, object: null };
  private kind: ElementKind;

  constructor(private service: TemplateService, private router: Router, private route: ActivatedRoute ) {
    this.route.url.subscribe((event) => {
      const path = event[0].path;
      this.kind = HEADER_DETAILS.get(path).kind;
      this.canDelete = service.can(Action.Delete, this.kind );
    });

    // this.config = this.buildRevisionConfig();
  }

  ngOnInit() {
    if (this.kind) {
      this.service.getItem(this.kind, this.route.snapshot.paramMap.get('id')).then(
        (item) => {
            this.action.id = item.id;
            this.item = item;
            if (this.selectedItem) { this.selectedItem.emit(item); } },
        (error) => { throw error; });
    }
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
        this.action.action = Action.Delete;
        this.onHideDetail();
      });
  }

  onItemSaved(item: IEntityEditAudit) {
    this.action.action = Action.Update;
    this.action.object = item;
    this.onHideDetail();
  }

  onGetPdf( item: IEntityEditAudit) {
    this.service.getPdf(item).then(
      (data) => { fileSaver.saveAs(data, item.name + '.pdf'); },
      (error) => { throw error; });
  }

}

