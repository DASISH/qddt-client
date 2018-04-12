import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Subject } from 'rxjs/Subject';
import { IEntityAudit } from '../shared/elementinterfaces/entityaudit';
import { TemplateService } from './template.service';

import { HEADER_DETAILS } from '../shared/elementinterfaces/headerdetail';
import { ElementKind } from '../shared/elementinterfaces/elements';
import { Page } from '../shared/table/table.page';
import { QddtMessageService } from '../core/global/message.service';
import { Action } from '../shared/elementinterfaces/detailaction';

@Component({
  selector: 'qddt-template-list',
  moduleId: module.id,
  templateUrl: './template-list.component.html',
  styles: [],
})
export class TemplateListComponent implements OnInit {
  public items: IEntityAudit[];
  public showProgressBar = false;
  public page = new Page;
  public kind: ElementKind;

  private searchKeys: string;
  private searchKeysListener = new Subject<string>();

  constructor(private service: TemplateService, private router: Router, private route: ActivatedRoute,
              private  messages: QddtMessageService ) {

    this.route.url.subscribe((event) => {
      const path = event[0].path;
      this.kind = HEADER_DETAILS.get(path).kind;
    });

    this.searchKeysListener
      .debounceTime(300)
      .distinctUntilChanged()
      .subscribe((searchString: string) => this.loadPage(searchString));

    this.messages.getAction().subscribe(event => {
      if (event.action === Action.Update || event.action === Action.Create) {
        this.loadPage();
      }
    });
  }


  public ngOnInit(): void {
    if (this.kind) {
      this.onSearchKey('');
    }
  }

  public onPage(page: Page) {
    this.page = new Page(page);
    this.loadPage(this.searchKeys);
  }

  public onSearchKey(search: string ) {
    this.searchKeys = search;
    this.searchKeysListener.next(search);
  }

  public onDetail(item: IEntityAudit ) {
    this.router.navigate(['./', item.id ], { relativeTo: this.route });
  }

  private loadPage(search?: string ) {
    this.showProgressBar = true;
    if (!search) { search = '*'; }
    this.service.searchByKind(this.kind, search, this.page).then(
      (result) => {
        this.page = new Page(result.page);
        this.items = result.content;
        this.showProgressBar = false; },
      (error) => {
        this.showProgressBar = false;
        throw error; });
  }
}


