import { Component, ViewEncapsulation, OnDestroy  } from '@angular/core';
import { UserService } from './core/user/user.service';
import { QddtPropertyStoreService } from './core/global/property.service';
import { QddtMessageService } from './core/global/message.service';
import { Subscription } from 'rxjs/Subscription';
import { IElement, IIdRef, IRevisionRef } from './shared/classes/interfaces';

// declare var $: any;


@Component({
  moduleId: module.id,
  selector: 'qddt-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [UserService]
})

export class AppComponent  implements OnDestroy {

  ref: IIdRef|IRevisionRef|IElement;

  subscription: Subscription;

  constructor(private users: UserService, private  properties: QddtPropertyStoreService, private messages: QddtMessageService ) {

    this.subscription = this.messages.getMessage()
      .subscribe((message) => this.showMessage(message));

  }

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.subscription.unsubscribe();
  }

  isLoggedIn(): boolean {
    return !this.users.isTokenExpired();
  }

  onInstruments() {
    this.properties.set('current', 'instrument');
  }

  onSequences() {
    this.properties.set('current', 'sequence');
  }

  onQuestions() {
    this.checkRouter('questionitems', 'list');
  }

  onHome() {
    this.checkRouter('home', 'survey');
  }

  onCategories() {
    this.checkRouter('categories', 'list');
  }

  onSchemes() {
    this.checkRouter('schemes', 'list');
  }

  onResponsedomains() {
    this.checkRouter('responsedomains', 'list');
  }

  onConstructs() {
    this.checkRouter('constructs', 'list');
  }

  onPublications() {
    this.checkRouter('publications', 'list');
  }


  private showMessage<T extends IIdRef|IRevisionRef|IElement>(element: T) {
    this.ref = element;
  }

  private checkRouter(target: string, value: string) {
    const current = this.properties.get('current');
    if (current === target) {
      const config = this.properties.get('home');
      if (config.current !== value) {
        this.properties.set(target, {'current': value});
      }
    } else if (this.properties.get(target) === '') {
      this.properties.set(target, {'current': value});
    }
    this.properties.set('current', target);

  }


}
