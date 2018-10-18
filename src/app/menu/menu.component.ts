import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, Observable } from 'rxjs';
import { QddtPropertyStoreService  } from '../core/services/property.service';
import { UserService } from '../core/services/user.service';
import { TemplateService } from '../template/template.service';
import { ActionKind, ElementKind } from '../shared/classes/enums';
import { HIERARCHY_POSITION } from '../core/classes/UserSettings';
import { element } from 'protractor';


declare var $: any;

export interface MenuItem { id: string; name: string; }

@Component({
  selector: 'qddt-menu',
  moduleId: module.id,
  providers: [],
  styleUrls: ['./menu.component.css'],
  templateUrl: './menu.component.html',
})
export class MenuComponent implements OnInit, OnDestroy, AfterViewInit {
  // public propertyChanged: Subscription;
  public isLoggedIn$: Observable<boolean>;

  public canSee = new Array<boolean>(20);

  public username;
  public elementKindRef = ElementKind;

  constructor(private userService: UserService, private property: QddtPropertyStoreService,
      private router: Router, private service: TemplateService) {
    this.username = this.getUserName();
    this.isLoggedIn$ = this.userService.loggedIn;
  }

  ngOnInit() {
    this.isLoggedIn$.subscribe(
      (connected) => {
        this.username = this.getUserName();
        this.setVisibility();
        if ( connected ) {
          this.router.navigate([this.property.userSetting.url]);
        }
      },
    (error) => console.error(error.toString())
    );
  }

  ngOnDestroy(): void {
    // this.propertyChanged.unsubscribe();
  }


  ngAfterViewInit() {
    $('.button-collapse').sideNav({
      menuWidth: 100, // Default is 300
      edge: 'left', // Choose the horizontal origin
      closeOnClick: true, // Closes side-nav on <a> clicks, useful for Angular/Meteor
      draggable: true});
    $('.dropdown-button').dropdown();
    $(document).ready(function() { $('.collapsible').collapsible(); });
  }

  getEmail(): string {
    if (!this.userService.isTokenExpired()) {
      return this.userService.getEmail();
    }
    return '';
  }

  getUserName(): string {
    if (!this.userService.isTokenExpired()) {
      return this.userService.getUsername().charAt(0).toUpperCase() + this.userService.getUsername().slice(1);
    }
    return 'NOT LOGGED IN';
  }

  logoutEvent() {
    this.userService.logout();
  }

  private hasAccess(kind: string|ElementKind): boolean {
    return this.userService.canDo(ActionKind.Read, this.service.getElementKind(kind));
  }

  onCheckUrl(event) {
    const parts = event.srcElement.value.toString().split('/');
    if (parts[parts.length - 1].length !== 36) { return; } // must be a valid UUID....
    let url;
    if (parts.length === 1) {
      url =  parts[0];
    } else if (parts.length >= 2) {
      url = parts[parts.length - 2] + '/' + parts[parts.length - 1];
    }

    if (event.inputType === 'insertFromPaste' && (parts.length >= 2)) {
        this.router.navigate([url]);
        event.srcElement.value = '';
    } else {
      event.srcElement.value = '';
      this.gotoUUID(url);
    }
  }

  onSurvey() {
    this.clearAll();
    this.router.navigate(['/survey']);
  }

  onStudy() {
    this.clearTopic();
    this.router.navigate(['/study']);
  }

  onTopic() {
    this.clearConcept();
    this.router.navigate(['/topic']);
  }

  onConcept() {
    this.router.navigate(['/concept']);
  }

  clearAll() {
    this.clearTopic();
    this.property.pathClear(HIERARCHY_POSITION.Survey);
    this.property.set('study', null);
  }

  clearTopic() {
    this.clearConcept();
    this.property.pathClear(HIERARCHY_POSITION.Study);
    this.property.set('topic', null);
  }

  clearConcept() {
    this.property.pathClear(HIERARCHY_POSITION.Topic);
    this.property.set('concept', null);
  }

  get path(): Array<MenuItem> {
    return this.property.menuPath;
  }

  private gotoUUID(uuid: string) {
    this.service.searchByUuid(uuid).then( (result) => {
      this.router.navigate([result.url]); },
      (error) => { throw  error; });
  }

  private setVisibility() {

    const newArr = new Array<boolean>(20);
    for (let item in ElementKind ) {
      newArr[item] = this.hasAccess(item);
    }
    this.canSee = newArr;
    console.log(this.canSee);
  }
}

