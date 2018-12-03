import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { User } from '../_models/user';
import { decode } from 'punycode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseUrl = environment.apiUrl + 'auth/';
  jwtHelper = new JwtHelperService();
  decodedToken: any;
  currentUser: User;
  private photoUrl = new BehaviorSubject<string>('../../assets/user.png');
  currentPhotoUrl = this.photoUrl.asObservable();

  constructor(private http: HttpClient) { }

  changeMemberPhoto(photoUrl: string) {
    this.currentUser.photoUrl = photoUrl;
    localStorage.setItem('user', JSON.stringify(this.currentUser));
    this.photoUrl.next(photoUrl);
  }

  login(model: any) {
    return this.http.post(this.baseUrl + 'login', model)
      .pipe(map((response: any) => {
        const user = response;
        if (user) {
          this.decodedToken = this.jwtHelper.decodeToken(user.token);
          localStorage.setItem('token', user.token);
          this.currentUser = user.user;
          localStorage.setItem('user', JSON.stringify(user.user));
          this.changeMemberPhoto(this.currentUser.photoUrl);
        }
      }));
  }

  logout() {
    localStorage.removeItem('token');
    this.decodedToken = null;

    localStorage.removeItem('user');
    this.currentUser = null;
  }

  register(user: User) {
    return this.http.post(this.baseUrl + 'register', user);
  }

  loggedIn() {
    const token = localStorage.getItem('token');
    return !this.jwtHelper.isTokenExpired(token);
  }

  setTokenAndUser() {
    const token = localStorage.getItem('token');
    if (token) {
      this.decodedToken = this.jwtHelper.decodeToken(token);
    }

    const user: User = JSON.parse(localStorage.getItem('user'));
    if (user) {
      this.currentUser = user;
      this.changeMemberPhoto(user.photoUrl);
    }
  }

  hasRole(allowedRoles): boolean {
    let isMatch = false;
    const userRoles = this.decodedToken.role as Array<string>;
    allowedRoles.forEach(role => {
      if (userRoles.includes(role)) {
        isMatch = true;
        return;
      }
    });

      return isMatch;
  }
}
