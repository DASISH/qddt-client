import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild,
  Router, Route,
  ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import {  UserService } from '../user/user.service';

@Injectable()
export class AdminGuard implements CanActivate, CanActivateChild  {

  constructor(private authService: UserService, private router: Router) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (!this.authService.isTokenExpired()) {

      if (this.checkParent(next.url.toString())) {
        return true;
      }
      this.router.navigate(['home']);
    }
    console.info('isTokenExpired');
    this.router.navigate(['login']) ; //, { queryParams: { returnUrl: 'home' }});
    return false;
  }

  canActivateChild(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.canActivate(next, state);
  }

  canLoad(route: Route): boolean {
    const url = `/${route.path}`;
    return !this.authService.isTokenExpired();
  }

  private checkParent(url: string): boolean {
    if (url === 'register') {
      const roles = this.authService.getRoles();
      return (roles.find(e => e === 'ROLE_ADMIN' || e === 'ROLE_SUPER') !== undefined);
    }
    return true;
  }
}
