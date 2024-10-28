const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');
const credentials = require('./serviceAccountKey.json');

initializeApp({
    credential: cert(credentials),
    storageBucket: 'gs://sahudyog-91011.appspot.com'
  });
const db = getFirestore();

const app = require("./app");
const path = require('path');

const port = 3000;
const server = app.listen(port, () => {
    console.log(`App running on the port ${port}`);
    console.log(`App is live at http://localhost:${3000}`);
})