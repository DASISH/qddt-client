import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TemplateService } from './template.service';

import { Page } from '../shared/classes/classes';
import { QddtMessageService } from '../core/global/message.service';
import { IEntityAudit, IPageSearch } from '../shared/classes/interfaces';
import { ActionKind, ElementKind} from '../shared/classes/enums';
import { HEADER_DETAILS } from '../shared/classes/constants';
import { QddtPropertyStoreService } from '../core/global/property.service';
import {DomainKind} from '../responsedomain/responsedomain.classes';

@Component({
  selector: 'qddt-template-list',
  moduleId: module.id,
  templateUrl: './template-list.component.html',
  styles: [],
})
export class TemplateListComponent implements OnInit, OnDestroy  {
  public items: IEntityAudit[];
  public showProgressBar = false;
  public pageSearch: IPageSearch;

  private alive = true;
  private path: string;
  private kind: ElementKind;

  constructor(private service: TemplateService, private router: Router, private route: ActivatedRoute,
              private messages: QddtMessageService, private properties: QddtPropertyStoreService ) {

    this.route.url
      .takeWhile(() => this.alive)
      .filter( (f) => f.length > 0)
      .subscribe((event) => {
        this.path = event[0].path;
        this.kind = HEADER_DETAILS.get(this.path).kind;
    });

    this.messages.getAction()
      .takeWhile(() => this.alive)
      .subscribe(event => {
        console.log('Action ' + ActionKind[event.action]);
        if (event.action === ActionKind.Update || event.action === ActionKind.Create || event.action === ActionKind.Filter) {
          // console.log('loading page on action');
          this.loadPage();
        }
      });
  }

  public ngOnInit(): void {
    if (this.kind) {
      // console.log('loading page on init');
      this.loadPage(); }
  }

  public onFetchItems(page: IPageSearch ) {
    // console.log('loading page on onFetchItems');
    this.setPageSearch(page);
    this.loadPage();
  }

  public onDetail(item: IEntityAudit ) {
    this.router.navigate(['./', item.id ], { relativeTo: this.route });
  }

  private loadPage(search?: string ) {

    this.showProgressBar = true;
    this.pageSearch = this.getPageSearch();

    if (search) { this.pageSearch.key = search; }

    this.service.searchByKind(this.pageSearch).then(
      (result) => {
        this.pageSearch.page = new Page(result.page);
        this.items = result.content;
        this.setPageSearch(this.pageSearch);
        this.showProgressBar = false; },
      (error) => {
        this.showProgressBar = false;
        throw error; });
  }

  private setPageSearch(pageSearch: IPageSearch ) {
    this.properties.set(this.path, pageSearch);
  }

  private getPageSearch(): IPageSearch {

    let pageSearch = this.properties.get(this.path);
    if (!pageSearch) {
      pageSearch = { kind: this.kind,  key: '*', page : new Page(), sort : 'modified,desc' };
      this.properties.set(this.path, pageSearch);
    }
    if (pageSearch.kind === ElementKind.RESPONSEDOMAIN && !pageSearch.keys ) {
      const KEY = 'ResponseKind';
      pageSearch.keys = new Map( [ [KEY, DomainKind[DomainKind.SCALE] ] ] );
    }
    if (pageSearch.kind === ElementKind.PUBLICATION && !pageSearch.keys ) {
      const KEY = 'publishedstatus';
      pageSearch.keys = new Map( [ [KEY, 'NOT_PUBLISHED' ] ] );
    }
    return pageSearch;
  }

  ngOnDestroy(): void {
    this.alive = false;
  }

}
