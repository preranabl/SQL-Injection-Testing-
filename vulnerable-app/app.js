const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const portfinder = require('portfinder');
const app = express();

// Connect to the SQLite database
const db = new sqlite3.Database('./database.db');

// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Serve the HTML form
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
});

// Vulnerable login endpoint
app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Vulnerable SQL query
    const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;

    db.all(query, (err, rows) => {
        if (err) {
            return res.status(500).send('Database error');
        }

        if (rows.length > 0) {
            res.send(`Login successful! Welcome, ${rows[0].username}`);
        } else {
            res.send('Login failed! Invalid username or password.');
        }
    });
});
// Automatically find an available port
portfinder.getPort((err, port) => {
    if (err) {
        console.error('Error finding available port:', err);
        return;
    }

    app.listen(port, () => {
        console.log(`Vulnerable app listening at http://localhost:${port}`);
    });
});