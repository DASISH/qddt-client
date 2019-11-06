import { takeWhile} from 'rxjs/operators';
import {Component, OnDestroy, AfterContentChecked, AfterViewInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ActionKind, DomainKind,
  ElementKind, Factory,
  HEADER_DETAILS,
  IEntityEditAudit,
  IPageSearch,
  MessageService,
  PropertyStoreService, ResponseDomain,
  UserService
} from '../../lib';


@Component({
  selector: 'qddt-template-component',
  templateUrl: './template.component.html',
})

export class TemplateComponent implements OnDestroy, AfterContentChecked, AfterViewInit {

  public readonly formId = Math.round( Math.random() * 10000);
  public newItem: IEntityEditAudit;

  public icon: any;
  public headerName: string;
  public showForm = false;
  private kind: ElementKind;
  private alive = true;
  private path: string;
  private refreshCount = 0;

  private canCreate: boolean;


  constructor(private route: ActivatedRoute, private router: Router, private  messages: MessageService,
              private service: UserService, private properties: PropertyStoreService ) {
    this.route.url.pipe(
    takeWhile(() => this.alive))
    .subscribe((event) => {
      this.path = this.route.firstChild.routeConfig.path; // '/:id'
      const detailIndex = this.path.lastIndexOf('/:id');
      if (detailIndex >= 0) {
        this.path = this.path.substr(0, detailIndex);
      }
      if (HEADER_DETAILS.has(this.path)) {
        this.kind = HEADER_DETAILS.get(this.path).kind;
        this.icon = HEADER_DETAILS.get(this.path).icon;
        this.headerName =  HEADER_DETAILS.get(this.path).headerName;
      }
      this.canCreate =  this.service.canDo(ActionKind.Create, this.kind);
    });

    this.messages.getAction().pipe(
      takeWhile(() => this.alive))
      .subscribe(event => {
        if (event.action === ActionKind.Filter && (event.id === 'ResponseKind' || event.id === 'publishedKind' ) ) {
          if (this.showForm) { this.onToggleForm(); }
          const param = this.route.snapshot.firstChild.params;
          if (param.id) { this.router.navigate(['../' ], { relativeTo: this.route.firstChild }); }
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
        this.messages.sendAction(  { id: '', action: ActionKind.Update, object: null });
      }
    if (this.showForm ) {
        this.refreshCount = 0;
        console.log('onToggleForm');
        const page =  this.properties.get(this.path) as IPageSearch;
        this.newItem = Factory.createInstance(this.kind);
        if (page.kind === ElementKind.RESPONSEDOMAIN) {
          (this.newItem as ResponseDomain).setResponseKind(DomainKind[page.keys.get('ResponseKind')]);
        }
      }
  }


  ngOnDestroy(): void {
    this.alive = false;
  }

  ngAfterContentChecked(): void {
  }

  ngAfterViewInit(): void {
    // M.AutoInit(document.getElementById('qtc-{{formId}}'));
  }

  // private getPageSearch(): IPageSearch {
  //   return (this.properties.get(this.path) || new PageSearch( { kind: ElementKind.RESPONSEDOMAIN } ) ) as IPageSearch;
  // }
}
