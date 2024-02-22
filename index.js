const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');

const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Welcome to movieit api');
});

app.listen(PORT, () => {
  console.log(`running at http://localhost:${PORT}`);
});
