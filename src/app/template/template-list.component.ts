import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { TemplateService } from './template.service';

import { Page } from '../shared/classes/classes';
import { QddtMessageService } from '../core/global/message.service';
import { IEntityAudit, IPageSearch } from '../shared/classes/interfaces';
import { ActionKind, ElementKind} from '../shared/classes/enums';
import { HEADER_DETAILS } from '../shared/classes/constants';
import { QddtPropertyStoreService } from '../core/global/property.service';

@Component({
  selector: 'qddt-template-list',
  moduleId: module.id,
  templateUrl: './template-list.component.html',
  styles: [],
})
export class TemplateListComponent implements OnInit, OnDestroy  {
  public items: IEntityAudit[];
  public showProgressBar = false;
  public kind: ElementKind;

  private alive = true;
  private path: string;
  private pageSearch: IPageSearch;

  constructor(private service: TemplateService, private router: Router, private route: ActivatedRoute,
              private  messages: QddtMessageService, private properties: QddtPropertyStoreService ) {

    this.route.url
      .takeWhile(() => this.alive)
      .subscribe((event) => {
        this.path = event[0].path;
        this.kind = HEADER_DETAILS.get(this.path).kind;
    });


    this.messages.getAction()
      .takeWhile(() => this.alive)
      .subscribe(event => {
        if (event.action === ActionKind.Update || event.action === ActionKind.Create) {
          this.loadPage();
        }
    });
  }

  public ngOnInit(): void {
    this.pageSearch = this.getPageSearch();
    if (this.kind) { this.loadPage(); }
  }

  public onFetchItems(search: IPageSearch ) {
    console.log('onFetchItems' + search);
    this.pageSearch = search;
    this.loadPage();
  }

  public onDetail(item: IEntityAudit ) {
    this.router.navigate(['./', item.id ], { relativeTo: this.route });
  }

  private loadPage(search?: string ) {
    this.showProgressBar = true;
    if (search) { this.pageSearch.key = search; }

    this.service.searchByKind(this.pageSearch).then(
      (result) => {
        this.pageSearch.page = new Page(result.page);
        this.items = result.content;
        this.showProgressBar = false; },
      (error) => {
        this.showProgressBar = false;
        throw error; });
  }

  private setPageSearch(pageSearch: IPageSearch ) {
    this.properties.set(this.path, pageSearch);
  }

  private getPageSearch(): IPageSearch {
    const pageSearch = this.properties.get(this.path);
    return this.getKeys((pageSearch) ? pageSearch : { kind: this.kind,  key: '*', page : new Page(), sort : 'modified,desc' });
  }

  ngOnDestroy(): void {
    this.setPageSearch( this.pageSearch );
    this.alive = false;
  }
  getKeys(search: IPageSearch): IPageSearch {
    if (search.kind === ElementKind.RESPONSEDOMAIN) {
      search.keys =  new Map([['ResponseKind', 'SCALE']]);
    }
/*     if (search.kind === ElementKind.CATEGORY) {
      search.keys =  new Map([['categoryKind', 'CATEGORY']]);
    }
 */    return search;
  }

}
