import { takeWhile } from 'rxjs/operators';
import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ActionKind, DomainKind,
  ElementKind, Factory,
  HEADER_DETAILS,
  IEntityEditAudit,
  IPageSearch,
  MessageService,
  PropertyStoreService, ResponseDomain,
  UserService,
  fadeInAnimation, fadeOutAnimation,
  PageSearch
} from '../../lib';


@Component({
  selector: 'qddt-template-component',
  styles: [
    'a.btn  {margin-bottom: 10px;}',
  ],
  templateUrl: './template.component.html',
  animations: [fadeInAnimation],
  host: { '[@fadeInAnimation]': '' }
})

export class TemplateComponent implements OnDestroy {

  public readonly formId = Math.round(Math.random() * 10000);
  public newItem: IEntityEditAudit;

  public icon: any;
  public headerName: string;
  public showForm = false;
  private kind: ElementKind;
  private alive = true;
  private path: string;
  private canCreate: boolean;

  constructor(private route: ActivatedRoute, private router: Router, private messages: MessageService,
    private service: UserService, private properties: PropertyStoreService) {
    this.route.url.pipe(
      takeWhile(() => this.alive))
      .subscribe(() => {
        this.path = this.route.firstChild.routeConfig.path; // '/:id'
        const detailIndex = this.path.lastIndexOf('/:id');
        if (detailIndex >= 0) {
          this.path = this.path.substr(0, detailIndex);
        }
        if (HEADER_DETAILS.has(this.path)) {
          this.kind = HEADER_DETAILS.get(this.path).kind;
          this.icon = HEADER_DETAILS.get(this.path).icon;
          this.headerName = HEADER_DETAILS.get(this.path).headerName;
        }
        this.canCreate = this.service.canDo(ActionKind.Create, this.kind);
      });

    this.messages.getAction().pipe(
      takeWhile(() => this.alive))
      .subscribe(event => {
        if (event.action === ActionKind.Filter && (event.id === 'ResponseKind' || event.id === 'publishedKind')) {
          if (this.showForm) { this.onToggleForm(); }
          const param = this.route.snapshot.firstChild.params;
          if (param.id) { this.router.navigate(['../'], { relativeTo: this.route.firstChild }); }
        }
      });
  }

  public canWrite(): boolean {
    return this.canCreate;
  }

  onToggleForm() {
    if (!this.canWrite()) { throw Error('Access denied'); }

    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.messages.sendAction({ id: '', action: ActionKind.Update, object: null });
    }
    if (this.showForm) {
      let pageSearch = this.properties.get(this.path) as IPageSearch;
      if (!pageSearch) {
        pageSearch = new PageSearch({ kind: this.kind, xmlLang: this.properties.userSetting.xmlLang });
        this.properties.set(this.path, pageSearch);
      }
      this.newItem = Factory.createFromSeed(this.kind, { xmlLang: pageSearch.xmlLang });
      if (pageSearch.kind === ElementKind.RESPONSEDOMAIN) {
        (this.newItem as ResponseDomain).setResponseKind(DomainKind[pageSearch.keys.get('ResponseKind')]);
      }
    }
  }

  ngOnDestroy(): void {
    this.alive = false;
  }
}
