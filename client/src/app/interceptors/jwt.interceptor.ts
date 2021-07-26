import { LoginService } from '@services/login.service';
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * JwtInterceptor - intercepts all requests to api and embeds the JWT token for authentication
 */
@Injectable()
export class JwtInterceptor implements HttpInterceptor {

    constructor(private _loginService: LoginService) { }

    intercept(req: HttpRequest<any>,
      next: HttpHandler): Observable<HttpEvent<any>> {

        const idToken = this._loginService.authToken;

        // Check that we have a token before adding it to the header
        if (idToken) {
          req = req.clone({ //add as bearer token
              headers: req.headers.set('Authorization', `Bearer ${idToken}`)
          });
        }

        return next.handle(req);
    }
}
