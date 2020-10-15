const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const bodyParser = require('body-parser');
const auth = require('./auth');

admin.initializeApp();
const app = express();

app.use(auth());

app.get('/data', async (req, res) => {
  const store = await admin.firestore().collection('messages').get();
  const data = store.docs.map((doc) => doc.data());
  res.json(data);
});

app.post('/data', async (req, res) => {
  const text = req.body.original;
  const writeResult = await admin.firestore().collection('messages').add({
    original: text,
  });
  res.status(201).send(`Created with id: ${writeResult.id}`);
});

const addItemRoute = async (req, res) => {
  const text = req.body['original'];
  const writeResult = await admin.firestore().collection('messages').add({
    original: text,
  });
  res.status(201).send(`Created with id: ${writeResult.id}`);
};

exports.app = functions.https.onRequest(app);

exports.addItem = functions.https.onRequest(addItemRoute);

exports.getItems = functions.https.onRequest(async (req, res) => {
  const store = await admin.firestore().collection('messages').get();
  const data = store.docs.map((doc) => doc.data());
  res.set('Cache-Control', 'private, max-age=300');
  res.status(201).json(data);
});

exports.makeUppercase = functions.firestore
  .document('messages/{id}')
  .onCreate((snap, context) => {
    const text = snap.data().original;
    functions.logger.log('Uppercasing', context.params.id, text);
    const uppercase = text.toUpperCase();
    return snap.ref.set({ uppercase }, { merge: true });
  });
