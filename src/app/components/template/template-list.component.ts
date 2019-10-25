import {filter, takeWhile} from 'rxjs/operators';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TemplateService } from '../../lib/services/template.service';

import { DomainKind } from '../../lib/classes/responsedomain.classes';
import { IEntityAudit, IPageSearch, ElementKind, HEADER_DETAILS, ActionKind, Page, PageSearch } from '../../lib';
import { MessageService, PropertyStoreService} from '../../lib/services';

declare var $;
declare var M;

@Component({
  selector: 'qddt-template-list',
  templateUrl: './template-list.component.html',
  styles: [],
})
export class TemplateListComponent implements OnInit, OnDestroy  {
  public items: IEntityAudit[];
  public showProgressBar = false;
  public pageSearch: IPageSearch;
  public toBeDeleted: IEntityAudit;

  public readonly formId = Math.round( Math.random() * 10000);

  private alive = true;
  private path: string;
  private kind: ElementKind;

  constructor(private service: TemplateService, private router: Router, private route: ActivatedRoute,
              private messages: MessageService, private properties: PropertyStoreService ) {

    this.route.url.pipe(
      takeWhile(() => this.alive),
      filter( (f) => f.length > 0))
      .subscribe((event) => {
        this.path = event[0].path;
        this.kind = HEADER_DETAILS.get(this.path).kind;
    });

    this.messages.getAction().pipe(
      takeWhile(() => this.alive))
      .subscribe(event => {
        console.log('Action ' + ActionKind[event.action]);
        if (event.action === ActionKind.Update || event.action === ActionKind.Create || event.action === ActionKind.Filter) {
          this.loadPage();
        }
      });
  }

  public ngOnInit(): void {
    if (this.kind) { this.loadPage(); }

    $(document).ready(function() {
      $('.modal').modal({
        ready: () => {
          M.updateTextFields();
        }
      });
    });
  }

  public ngOnDestroy(): void {
    this.alive = false;
  }


  public onFetchItems(page: IPageSearch ) {
    this.setPageSearch(page);
    this.loadPage();
  }

  public onDetail(item: IEntityAudit ) {
    this.router.navigate(['./', item.id ], { relativeTo: this.route });
  }

  public onDelete(item: IEntityAudit) {
    console.log(JSON.stringify(item));
    this.service.delete(item)
    .subscribe(() => {
      this.loadPage();
      $('#confirmModal' + this.formId).modal('close');
    },
    (error) => { throw error; });
  }

  public onConfirmDelete(item: IEntityAudit) {
    this.toBeDeleted = item;
    $('#confirmModal' + this.formId).modal('open');
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
       },
      (error) => { throw error; })
      .then( () => this.showProgressBar = false );
  }

  private setPageSearch(pageSearch: IPageSearch ) {
    this.properties.set(this.path, pageSearch);
  }

  private getPageSearch(): IPageSearch {

    let pageSearch =  this.properties.get(this.path) as IPageSearch;
    if (!pageSearch) {
      pageSearch =   new PageSearch( { kind: this.kind } );
      this.setPageSearch(pageSearch);
    } else {
      pageSearch = new PageSearch(pageSearch);
    }
    pageSearch.page.size = this.properties.userSetting.pageSize;

    if (pageSearch.kind === ElementKind.USER && pageSearch.sort === 'modified,desc') {
      pageSearch.sort = 'name,asc';
    }
    // else if (pageSearch.kind === ElementKind.CHANGE_LOG && pageSearch.sort === 'modified,desc') {
    //   pageSearch.sort = 'ref_modified,desc';
    // }

      const RDKEY = 'ResponseKind';
    if (pageSearch.kind === ElementKind.RESPONSEDOMAIN && !pageSearch.keys.has(RDKEY)) {
      pageSearch.keys.set(RDKEY, DomainKind[DomainKind.SCALE]);
    }

    const PKEY = 'publishedKind';
    if (pageSearch.kind === ElementKind.PUBLICATION && !pageSearch.keys.has(PKEY)) {
      pageSearch.keys.set(PKEY, 'NOT_PUBLISHED');
    }
    return pageSearch;
  }

}
