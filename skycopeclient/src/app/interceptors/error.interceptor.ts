import { LoginService } from '@services/login.service';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpEvent, HttpHandler, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap, map } from 'rxjs/operators';
import { Router } from '@angular/router';

/**
 * JwtInterceptor - intercepts all ERROR requests from client and if the error is auth-related then log the user out automatically (redirect to login)
 */
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

    constructor(private _authService: LoginService, private _router: Router) { }

    handleResponseError(error, request?:HttpRequest<any>, next?) {

      // If the response is 401 Unauthorized then  log the user out
      if ([403].includes(error.status) ) {
        this._authService.logout();
        this._router.navigate(['/login']);
        return throwError("Invalid JWT Token");
      }
      else
         return throwError(error);
    }

    intercept(req: HttpRequest<any>,
        next: HttpHandler): Observable<any> {
        return next.handle(req)
          .pipe(catchError( (err: HttpErrorResponse) => {
            return this.handleResponseError(err, req, next);

          })
        );
    }
}
