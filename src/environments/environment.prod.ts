export const environment = {
  production: true,

  // API Configuration for FastAPI backend (production)
  apiUrl: 'https://imam-back-02.wfrley.site',
  apiTimeout: 30000,
  fileUrl: 'https://imam-back-02.wfrley.site',
  imageUrl: 'https://imam-back-02.wfrley.site',
   aiUrl: 'https://edu-ai-test-26-02.wfrley.site',
  wsBaseUrl: 'wss://imam-back-02.wfrley.site',
  aiImageUrl: 'https://moga-img-rec.wfrley.site',

  // Auth configuration
  defaultauth: 'jwt',  // Use real JWT auth in production
  fakeapi: false,  // Always use real API in production

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