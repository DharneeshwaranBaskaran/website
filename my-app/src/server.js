const express = require('express');
const cors = require('cors');
const cors = require('cors');
app.use(cors());
// const app = express();

// // Enable CORS for all routes
// app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

app.use(express.json());

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  // Perform login validation here
  // For simplicity, we'll just send a success response if the username and password are non-empty
  if (username && password) {
    res.status(200).json({ message: 'Login successful' });
  } else {
    res.status(401).json({ message: 'Login failed' });
  }
});

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});