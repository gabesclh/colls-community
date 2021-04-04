import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FirebaseApp } from '@angular/fire';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable, of, throwError } from 'rxjs';
import { catchError, delay, mergeMap, retryWhen, switchMap } from 'rxjs/operators';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor {

  retry = 2;

  constructor(private auth: AuthService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(catchError(err => {
      if (err.status === 401 && request.url.search('login') === -1 && request.url.search('signup') === -1) {
        this.auth.refreshToken();
        const token = localStorage.getItem('tkn');
        const newReq = request.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`
          }
        });
        return next.handle(newReq);
      } else {
        return throwError(err);
      }
    }), retryWhen((errors: Observable<any>) => errors.pipe(
      delay(1000),
      mergeMap(error => this.retry-- > 0 ? of(error) : throwError(error))
    ))) as any;

  }
}
