const express = require('express');
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');

// Create Express app and HTTP server
const app = express();
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server);

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

const url = 'mongodb+srv://s223946918:ESFl9pIBQJ5NCz98@cluster0.aqhgcai.mongodb.net/'; // MongoDB connection URL
const client = new MongoClient(url);
const dbName = 'dataProtectionDB';

// Track the number of connected users
let connectedUsers = 0;

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
            
            // Emit real-time message to the connected clients via Socket.IO
            io.emit('formSubmitted', formData);
        } catch (err) {
            res.status(500).send('Error: Unable to save your data.');
        }
    });

    // Set up Socket.IO connection handling
    io.on('connection', (socket) => {
        // Increment user count when a new user connects
        connectedUsers++;
        console.log('A user connected. Total users:', connectedUsers);

        // Notify all clients about the updated user count
        io.emit('userCountUpdated', connectedUsers);

        // Handle disconnection
        socket.on('disconnect', () => {
            connectedUsers--;
            console.log('A user disconnected. Total users:', connectedUsers);
            io.emit('userCountUpdated', connectedUsers);
        });
    });

    // Start the server
    server.listen(3000, () => {
        console.log('Server and Socket.IO are running on port 3000');
    });
}

main().catch(console.error);
