import express from 'express';
import { MongoClient } from 'mongodb';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import http from 'http';
import { Server } from 'socket.io';

// Create Express app and HTTP server
const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));

// Get the directory name for the static files
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(__dirname));

// MongoDB connection
const url = 'mongodb+srv://s223946918:ESFl9pIBQJ5NCz98@cluster0.aqhgcai.mongodb.net/mongodb+srv://<your-connection-string>';
const client = new MongoClient(url);
const dbName = 'dataProtectionDB';

let connectedUsers = 0; // Track connected users

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

    // Handle Socket.IO connections
    io.on('connection', (socket) => {
        connectedUsers++;
        io.emit('userCountUpdated', connectedUsers);

        socket.on('disconnect', () => {
            connectedUsers--;
            io.emit('userCountUpdated', connectedUsers);
        });
    });

    // Start the server
    server.listen(3000, () => {
        console.log('Server and Socket.IO are running on port 3000');
    });
}

main().catch(console.error);
