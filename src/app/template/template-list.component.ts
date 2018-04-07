import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Subject } from 'rxjs/Subject';
import { Column } from '../shared/table/table.column';
import { IEntityAudit } from '../shared/elementinterfaces/entityaudit';
import { TemplateService } from './template.service';

import { HEADER_DETAILS } from '../shared/elementinterfaces/headerdetail';
import { ElementKind, QDDT_ELEMENTS } from '../shared/elementinterfaces/elements';
import { LIST_COLUMNS } from '../shared/table/table.column-map';
import { PATH_KIND_MAP } from './template.path-mapping';
import { Page } from '../shared/table/table.page';

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

  private searchKeys: string;
  private searchKeysSubject = new Subject<string>();
  private kind: ElementKind;

  constructor(private service: TemplateService, private router: Router, private route: ActivatedRoute ) {

    this.route.url.subscribe((event) => {
      const path = event[0].path;
      this.kind = HEADER_DETAILS.get(path).kind;
    });

    this.searchKeysSubject
      .debounceTime(300)
      .distinctUntilChanged()
      .subscribe((searchString: string) => {
        this.showProgressBar = true;
        service.searchItems(this.kind, searchString, this.page).then(
          (result) => {
            this.page = result.page;
            this.items = result.content;
            this.showProgressBar = false; },
          (error) => {
            this.showProgressBar = false;
            throw error; });
      });
  }


  public ngOnInit(): void {
    if (this.kind) {
      this.onSearchKey('');
    }
  }

  public onPage(page: Page) {
    this.page = page;
    this.searchKeysSubject.next(this.searchKeys);
  }

  public onSearchKey(search: string ) {
    this.searchKeys = search;
    this.searchKeysSubject.next(search);
  }

  public onDetail(item: IEntityAudit ) {
    this.router.navigate(['./', item.id ], { relativeTo: this.route });
  }

}


