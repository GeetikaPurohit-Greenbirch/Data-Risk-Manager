// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {

  production: false,
  apiBaseUrl: 'http://54.170.83.99:8080/', /// for user module
  apiAllBaseUrl: 'http://54.216.61.22:8080/', /// for other modules
  apiLineageBaseUrl: 'http://34.242.250.156:8080/', /// for other modules

  // okta: {
  //   clientId: 'kdqcweVMIWwiYtZtIvJmfrLUJ8LVXKor',
  //   issuer: 'https://dev-e4q8v4ezgegswlh6.us.auth0.com',

  //   redirectUri: 'http://localhost:4203/login/home',
  //   postLogoutRedirectUri: 'http://localhost:4203/login',
  //   responseType: ['code'],

  //   scopes: ['openid', 'profile', 'email'],
  //   pkce: true
  // },


  Auth0: {
  production: false,
  auth0Domain: 'dev-e4q8v4ezgegswlh6.us.auth0.com',
  clientId: '3p8QkfnRZqdewRwL9AASo7xpNslOL2n7',
  clientSecret: 'NFQkJZcnhA628kcI9-9gaOKVj20UUWvIvgUZqztjqzkOtMCiDeZc3d4ZoebdHKTV', // Avoid this in production; use a backend in production
  audience: 'https://dev-e4q8v4ezgegswlh6.us.auth0.com/api/v2/',
  grant_type: 'client_credentials'
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
