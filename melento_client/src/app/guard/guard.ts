import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { LocalStorageService } from '../services/local-storage-service.service';
@Injectable({
  providedIn: 'root',
})
export class Guard implements CanActivate {
  constructor(
    private localStorageService: LocalStorageService,
    private router: Router
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    let role = this.localStorageService.getItem('role');

    if (role === 'admin') {
      return true;
    }
    console.log('Sorry, no access for role ' + role);
    this.router.navigate(['/home']);
    return false;
  }
}
