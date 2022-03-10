// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  firebase: {
    projectId: 'dev-lime-tracker.com',
    appId: 'dev:lime:tracker:com',
    databaseURL: 'https://dev-db.lime-tracker.com',
    storageBucket: 'dev-bucket-lime-tracker.com',
    locationId: 'europe-central2',
    apiKey: 'devLimeTrackerComDevLimeTrackerComDevLi',
    authDomain: 'dev.lime-tracker.com',
    messagingSenderId: '100000000000',
    measurementId: 'G-DEVLIMETRA',
  },
  useEmulators: true,
  production: false
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
