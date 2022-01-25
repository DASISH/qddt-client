import { Injectable } from '@angular/core';
import { UserService } from './user.service';
import { PropertyStoreService } from './property.service';
import { ActionKind, ElementKind } from '../enums';
import { HEADER_DETAILS } from '../consts';
import { CanActivate, CanActivateChild, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';



@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {

  constructor(private authService: UserService, private router: Router, private property: PropertyStoreService) {
    // console.debug('AuthGuard created');
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {

    if (state.url !== '/') {
      this.property.userSetting.url = state.url;
      this.property.userSetting.save();
      const key = HEADER_DETAILS.get(state.url.substr(1));
      const kind = key?.kind || ElementKind.NONE;
      if (!this.authService.canDo(ActionKind.Read, kind)) return false;
    }



    if (!this.authService.isTokenExpired()) {
      return true;
    }

    // this.router.navigate([{ outlets: { popup: ['login'] } }]);

    this.router.navigate(['/login']);

    // const redirectUrl = next['_routerState']['url'];
    // console.debug('isTokenExpired -> redirecting to login ' + redirectUrl );
    // this.router.navigateByUrl(
    //   this.router.createUrlTree( ['/login'], { queryParams: { redirectUrl } } )
    // );
    return false;
  }

  canActivateChild(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.canActivate(next, state);
  }

}
