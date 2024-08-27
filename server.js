const express = require('express');
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

const url = 'mongodb+srv://s223946918:ESFl9pIBQJ5NCz98@cluster0.aqhgcai.mongodb.net/'; // Connection URL for your MongoDB
const client = new MongoClient(url);

const dbName = 'dataProtectionDB';

async function main() {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db(dbName);
    const formsCollection = db.collection('forms');

    // Serve the HTML form
    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, 'index.html'));
    });

    // Handle form submission
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
            res.send('Thank you! Your form has been submitted.');
        } catch (err) {
            res.status(500).send('Error: Unable to save your data.');
        }
    });

    app.listen(3000, () => {
        console.log('Server is running on port 3000');
    });
}

main().catch(console.error);
