import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { throwError, BehaviorSubject } from 'rxjs';
import { User } from './user.model';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

export interface AuthResponseData {
    kind: string;
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    registered?: boolean;
}

@Injectable()

export class AuthService {

    user = new BehaviorSubject<User>(null);
    private tokenTimer: any;
    constructor(private Http: HttpClient, private router: Router) { }

  onSigup(e: string, p: string) {
    return this.Http.post<AuthResponseData>
    ('https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=' + environment.firebaseAPIKey,
      {
        email: e,
        password: p,
        returnSecureToken: true
      }
    ).pipe(
      catchError(this.errorHandle), tap( resData => {
          this.authHandle(resData.email, resData.localId, resData.idToken, + resData.expiresIn);
      })
    );
  }

  autoLogin() {
    const userData: {
        email: string,
        id: string,
        _token: string,
        _tokenExpirationDate: string
    } = JSON.parse(localStorage.getItem('userData'));
    if (!userData) {
    return;
    }
    const loadUser = new User(
        userData.email, userData.id, userData._token, new Date(userData._tokenExpirationDate)
    );
    if (loadUser.token) {
        this.user.next(loadUser);
        const expDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
        this.autoLogout(expDuration);
    }
  }

  onLogin(e: string, p: string) {
    return this.Http.post<AuthResponseData>
    ('https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=' + environment.firebaseAPIKey,
      {
        email: e,
        password: p,
        returnSecureToken: true
      }
    ).pipe(
        catchError(this.errorHandle), tap( resData => {
            this.authHandle(resData.email, resData.localId, resData.idToken, + resData.expiresIn);
        })
      );
  }

  onLogout() {
      this.user.next(null);
      this.router.navigate(['/auth']);
      localStorage.removeItem('userData');
      if (this.tokenTimer) {
          clearTimeout(this.tokenTimer);
          this.tokenTimer = null;
      }
  }

  autoLogout(expDuration: number) {
    this.tokenTimer = setTimeout(() => {
        this.onLogout();
    }, expDuration);
  }

  private errorHandle(errRes: HttpErrorResponse) {
        let errMessage = 'An unknown error occured';
        if (!errRes.error || !errRes.error.error) {
            return throwError(errMessage);
        }
        switch (errRes.error.error.message) {
            case 'EMAIL_EXISTS':
                errMessage = 'This Email Already Exist.';
                break;
            case 'EMAIL_NOT_FOUND':
                errMessage = 'This Email is not registered.';
                break;
            case 'INVALID_PASSWORD':
                errMessage = 'Passwrd is not valid.';
                break;
        }
        return throwError(errMessage);
  }

  private authHandle(email: string, userId: string, token: string, expireIn: number) {
    const expirationDate = new Date(new Date().getTime() + expireIn * 1000);
    const userData = new User(email, userId, token, expirationDate);
    this.user.next(userData);
    this.autoLogout(expireIn * 1000);
    localStorage.setItem('userData', JSON.stringify(userData));
  }

}
