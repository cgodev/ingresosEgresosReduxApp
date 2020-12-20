import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, Routes, CanLoad } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { take, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanLoad {

  constructor(private authService: AuthService,
    private router: Router){

  }

  canActivate(): Observable<boolean> {

    return this.authService.isAuth().pipe(
      tap(status => {
        if( !status ) {this.router.navigate(['/login'])}
      })
    );
  }

  canLoad(): Observable<boolean> {
    return this.authService.isAuth().pipe(
      tap(status => {
        if( !status ) {this.router.navigate(['/login'])}
      }),
      take(1)
    );
  }

}
