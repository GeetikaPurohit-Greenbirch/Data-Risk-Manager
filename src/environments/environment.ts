// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {

  production: true,
  apiBaseUrl: ' https://api.dev.datariskmanager.net/auth/', /// for user module
  apiAllBaseUrl: ' https://api.dev.datariskmanager.net/entity/', /// for other modules
  apiLineageBaseUrl: ' https://api.dev.datariskmanager.net/lineage/', /// for Lineage modules

  // okta: {
  //   clientId: 'kdqcweVMIWwiYtZtIvJmfrLUJ8LVXKor',
  //   issuer: 'https://dev-e4q8v4ezgegswlh6.us.auth0.com',

  //   redirectUri: 'http://localhost:4203/login/home',
  //   postLogoutRedirectUri: 'http://localhost:4203/login',
  //   responseType: ['code'],

  //   scopes: ['openid', 'profile', 'email'],
  //   pkce: true
  // },


  auth: {
    domain: 'dev-e4q8v4ezgegswlh6.us.auth0.com',
    clientId: '3p8QkfnRZqdewRwL9AASo7xpNslOL2n7',
    audience: 'https://dev-e4q8v4ezgegswlh6.us.auth0.com/api/v2/',
  }

};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
