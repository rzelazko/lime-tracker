// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  firebase: {
    projectId: 'lime-tracker-com',
    appId: '1:500993644333:web:86ebcf9190780497fae5a4',
    databaseURL: 'https://lime-tracker-com-default-rtdb.europe-west1.firebasedatabase.app',
    storageBucket: 'lime-tracker-com.appspot.com',
    locationId: 'europe-central2',
    apiKey: 'AIzaSyBBHyGuDdYAGTbty08_XK2lFqbpR6fPQjc',
    authDomain: 'lime-tracker-com.firebaseapp.com',
    messagingSenderId: '500993644333',
    measurementId: 'G-ZEDQ00W5ZT',
  },
  useEmulators: true,
  emulatorHost: "localhost",
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
