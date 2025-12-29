// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {

  production: true,
  apiBaseUrl: ' https://api.dev.datariskmanager.net/auth/', /// for user module
  apiAllBaseUrl: ' https://api.dev.datariskmanager.net/entity/', /// for other modules
  apiLineageBaseUrl: ' http://api.dev.datariskmanager.net/lineage/', /// for Lineage modules  
  auth: {
    domain: 'dev-e4q8v4ezgegswlh6.us.auth0.com',
    clientId: '3p8QkfnRZqdewRwL9AASo7xpNslOL2n7',
    audience: 'https://dev-e4q8v4ezgegswlh6.us.auth0.com/api/v2/',
    AUTH_EMAIL:"manish.pandey@greenbirch.net",
    AUTH_PASSWORD:"GreenBirch@123",
  }

};

// export const environment = {
//     production: true,
//     apiBaseUrl: 'https://api.demo.datariskmanager.net/auth/',
//     apiAllBaseUrl: 'https://api.demo.datariskmanager.net/entity/',
//     apiLineageBaseUrl: 'https://api.demo.datariskmanager.net/lineage/',

//     auth: {
//         domain: 'dev-e4q8v4ezgegswlh6.us.auth0.com',
//         clientId: 'A7ZbrWPkayNsZ8VBCFKB2cyCrepkZpHx',
//         audience: 'https://dev-e4q8v4ezgegswlh6.us.auth0.com/api/v2/',
//            AUTH_EMAIL:"manish.pandey@greenbirch.net",
//            AUTH_PASSWORD:"GreenBirch@123",
//       }
//   };
  
