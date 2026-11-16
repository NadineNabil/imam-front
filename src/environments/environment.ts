// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,

  // API Configuration for FastAPI backend 
  apiUrl: 'https://edu-back-dev-26-02.wfrley.site',
  apiTimeout: 30000,
  fileUrl: 'https://edu-back-dev-26-02.wfrley.site',
  imageUrl: 'https://edu-back-dev-26-02.wfrley.site',
  aiUrl: 'https://edu-ai-dev-26-02.wfrley.site',
  wsBaseUrl: 'wss://edu-back-dev-26-02.wfrley.site',
  aiImageUrl: 'https://moga-img-rec.wfrley.site',

  // Auth configuration (kept for backwards compatibility during migration)
  defaultauth: 'fake-backend',
  fakeapi: false,

  // Firebase config (if needed)
  firebaseConfig: {
    apiKey: '',
    authDomain: '',
    databaseURL: '',
    projectId: '',
    storageBucket: '',
    messagingSenderId: '',
    appId: '',
    measurementId: ''
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
