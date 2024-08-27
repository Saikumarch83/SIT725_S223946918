// server.test.js

const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const path = require('path');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));
app.use(bodyParser.json());

const url = 'mongodb+srv://s223946918:ESFl9pIBQJ5NCz98@cluster0.aqhgcai.mongodb.net/';
const dbName = 'dataProtectionDB';

let client;
let db;
let formsCollection;

beforeAll(async () => {
  client = new MongoClient(url);
  await client.connect();
  db = client.db(dbName);
  formsCollection = db.collection('forms');
});

afterAll(async () => {
  await client.close();
});

app.post('/submit', async (req, res) => {
  try {
    const formData = {
      fullName: req.body.fullName,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
      address: req.body.address,
      dob: new Date(req.body.dob),
    };

    await formsCollection.insertOne(formData);

    res.json({
      success: true,
      data: formData,
    });
  } catch (err) {
    res.status(500).send('Error: Unable to save your data.');
  }
});

describe('POST /submit', () => {
  it('should submit form data and store it in the database', async () => {
    const formData = {
      fullName: 'Sai',
      email: 'Sai@example.com',
      phoneNumber: '0425700709',
      address: '132 kelvinside road',
      dob: '1998-04-07', // Only the date component
    };

    const response = await request(app).post('/submit').send(formData);

    // Assert that the response status is 200
    expect(response.statusCode).toBe(200);

    // Assert that the response body matches the sent data
    expect(response.body.data.dob.split('T')[0]).toBe(formData.dob); // Compare only the date part

    // Check if the data is actually stored in the database
    const storedData = await formsCollection.findOne({ email: formData.email });
    expect(storedData.fullName).toBe(formData.fullName);
    expect(storedData.email).toBe(formData.email);
    expect(storedData.phoneNumber).toBe(formData.phoneNumber);
    expect(storedData.address).toBe(formData.address);
    expect(storedData.dob.toISOString().split('T')[0]).toBe(formData.dob); // Compare only the date part
  });
});
