import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild,
         Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import {TOKEN_NAME, UserService} from './user.service';
import {QddtPropertyStoreService} from './property.service';

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild  {

  private menupath = ['survey', 'study', 'topic', 'concept'];

  constructor(private authService: UserService, private router: Router, private property: QddtPropertyStoreService) {
    console.log('AuthGuard created');
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {

    const redirectUrl = next['_routerState']['url'];
    if (state.url !== '/') {
      this.property.userSetting.url = state.url;
      this.property.userSetting.save();
    }
    if (!this.authService.isTokenExpired()) {
      return true;
    }

    console.log('isTokenExpired -> redirecting to login ' + redirectUrl );
    this.router.navigateByUrl(
      this.router.createUrlTree( ['/login'], { queryParams: { redirectUrl } } )
    );
    return false;
  }

  canActivateChild(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.canActivate(next, state);
  }

}
