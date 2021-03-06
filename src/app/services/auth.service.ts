import { Injectable } from '@angular/core';

declare var Keycloak: any;

@Injectable()
export class AuthService {
  static auth: any = {};

  init(): Promise<any> {
    return new Promise((resolve, reject) => {
      const keycloakAuth = Keycloak('assets/keycloak/keycloak.json');
      keycloakAuth.init({onLoad: 'login-required'})
        .success(() => {
      
          AuthService.auth.loggedIn = true;
          AuthService.auth.keycloak = keycloakAuth;
          AuthService.auth.logoutUrl = keycloakAuth.authServerUrl
            + '/realms/Analytix/protocol/openid-connect/logout?redirect_uri='
            + document.baseURI;
     
          resolve('');
        })
        .error(() => {
          reject();
        });
    });
  }

  getToken(): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      if (AuthService.auth.keycloak.token) {
        AuthService.auth.keycloak
          .updateToken(60)
          .success((refreshed) => {
            console.log('refreshed ' + refreshed);
            resolve(<string>AuthService.auth.keycloak.token);
          })
          .error(() => {
            reject('Failed to refresh token');
          });
      } else {
        reject('Not logged in');
      }
    });
  }

  getParsedToken() {
    console.log("token : "+AuthService.auth.keycloak.tokenParsed)
    return AuthService.auth.keycloak.tokenParsed;
  }

  logout() {
 
    AuthService.auth.loggedIn = false;
    AuthService.auth.authz = null;
    window.location.href = AuthService.auth.logoutUrl;
  }
}
