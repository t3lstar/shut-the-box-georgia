const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Serve static files from the public directory
app.use(express.static('public'));

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Server startup logging - this is an intentional server-side log
app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Shut the Box game server running at http://localhost:${port}`);
}); 