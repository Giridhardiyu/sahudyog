const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');
const credentials = require('./serviceAccountKey.json');

initializeApp({
    credential: cert(credentials),
    storageBucket: 'gs://sahudyog-91011.appspot.com'
  });
const db = getFirestore();