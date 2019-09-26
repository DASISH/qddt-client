import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject} from 'rxjs/internal/BehaviorSubject';
import {
  ActionKind,
  ElementKind,
  getElementKind,
  HierarchyPosition,
  MenuItem,
  PropertyStoreService,
  StringIsNumber, TemplateService,
  UserService
} from '../../lib';

declare var $: any;

@Component({
  selector: 'qddt-menu',
  providers: [],
  styleUrls: ['./menu.component.css'],
  templateUrl: './menu.component.html',
})
export class MenuComponent implements OnInit, OnDestroy, AfterViewInit {

  public canSee = new Array<boolean>(20);
  public isLoggedIn$: BehaviorSubject<boolean>;
  public username;
  public elementKindRef = ElementKind;

  constructor(private userService: UserService, public property: PropertyStoreService,
      private router: Router, private service: TemplateService) {
    this.username = this.getUserName();
    this.isLoggedIn$ = userService.loggedIn;
  }

  ngOnInit() {
    this.isLoggedIn$.subscribe(
      (connected) => {
        console.log('loggedIn ' + connected);
        this.username = this.getUserName();
        this.setVisibility();
        if ( connected ) {
          this.router.navigate([this.property.userSetting.url]);
        } else {
          console.log('should have rerouted...');
          // this.router.navigate([{ outlets: { popup: ['login'] } }]);
          this.router.navigate(['/login']);
          // const redirectUrl = this.property.userSetting.url;
          // this.router.navigateByUrl(
          //   this.router.createUrlTree( ['/login'], { queryParams: { redirectUrl } } )
          // );
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
    $('.collapsible').collapsible();
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
    this.clearStudy();
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

  get path(): Array<MenuItem> {
    return this.property.menuPath;
  }

  private clearStudy() {
    this.clearTopic();
    this.property.pathClear(HierarchyPosition.Study);
    this.property.set('study', null);
  }

  private clearTopic() {
    this.clearConcept();
    this.property.pathClear(HierarchyPosition.Topic);
    this.property.set('topic', null);
  }

  private clearConcept() {
    this.property.pathClear(HierarchyPosition.Concept);
    this.property.set('concept', null);
  }

  private hasAccess(kind: string|ElementKind): boolean {
    return this.userService.canDo(ActionKind.Read, getElementKind(kind));
  }

  private gotoUUID(uuid: string) {
    this.service.searchByUuid(uuid).then( (result) => {
      this.router.navigate([result.url]); },
      (error) => { throw  error; });
  }

  private setVisibility() {
    this.canSee =  Object.keys(ElementKind)
      .filter(StringIsNumber)
      .map(key => this.hasAccess(key));
    // console.log(this.canSee);
  }
}

