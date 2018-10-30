import { Component, ViewEncapsulation, OnDestroy  } from '@angular/core';
import { UserService } from './core/services/user.service';
import { QddtPropertyStoreService } from './core/services/property.service';
import { QddtMessageService } from './core/services/message.service';
import { IElement, IIdRef, IRevisionRef } from './shared/classes/interfaces';

// declare var $: any;


@Component({

  selector: 'qddt-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None,
})

export class AppComponent  implements OnDestroy {

  ref: IIdRef|IRevisionRef|IElement;

  private subscription;

  constructor(private users: UserService, private  properties: QddtPropertyStoreService,
              private messages: QddtMessageService ) {

    this.subscription = this.messages.getMessage()
      .subscribe((message) => this.showMessage(message));

  }

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.subscription.unsubscribe();
  }

  isLoggedIn(): boolean {
    const isExpired = this.users.isTokenExpired();
    if (isExpired && this.users.loggedIn.getValue()) {
      this.users.loggedIn.next(false);
    }
    return !isExpired;
  }


  private showMessage<T extends IIdRef|IRevisionRef|IElement>(element: T) {
      this.ref = element;
  }

  // private checkRouter(target: string, value: string) {
  //   const current = this.properties.get('current');
  //   if (current === target) {
  //     const config = this.properties.get('home');
  //     if (config.current !== value) {
  //       this.properties.set(target, {'current': value});
  //     }
  //   } else if (this.properties.get(target) === '') {
  //     this.properties.set(target, {'current': value});
  //   }
  //   this.properties.set('current', target);
  //
  // }


}
