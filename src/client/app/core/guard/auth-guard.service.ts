import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild,
         Router, Route,
         ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import {  UserService } from '../user/user.service';

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild  {

  constructor(private authService: UserService, private router: Router) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (!this.authService.isTokenExpired()) {
      // this.authService.getRoles()

      return true;
    }
    this.router.navigate(['/login'], { queryParams: { returnUrl: 'home' }});
    return false;
  }

  canActivateChild(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.canActivate(next, state);
  }

  canLoad(route: Route): boolean {
    const url = `/${route.path}`;
    return !this.authService.isTokenExpired();
  }

}
