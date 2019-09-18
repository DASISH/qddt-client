import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild,
         Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import {UserService} from './user.service';
import {PropertyStoreService} from './property.service';



@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild  {

  constructor(private authService: UserService, private router: Router, private property: PropertyStoreService) {
    console.log('AuthGuard created');
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {

    if (state.url !== '/') {
      this.property.userSetting.url = state.url;
      this.property.userSetting.save();
    }
    if (!this.authService.isTokenExpired()) {
      return true;
    }

    // this.router.navigate([{ outlets: { popup: ['login'] } }]);

    this.router.navigate([ '/login']);

    // const redirectUrl = next['_routerState']['url'];
    // console.log('isTokenExpired -> redirecting to login ' + redirectUrl );
    // this.router.navigateByUrl(
    //   this.router.createUrlTree( ['/login'], { queryParams: { redirectUrl } } )
    // );
    return false;
  }

  canActivateChild(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.canActivate(next, state);
  }

}
