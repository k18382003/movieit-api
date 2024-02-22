const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');
const accountRoutes = require('./routes/account-routes');

const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

app.get('/movieit/api', (req, res) => {
  res.send('Welcome to movieit api');
});

// all users routes
app.use('/movieit/api/account', accountRoutes);

app.listen(PORT, () => {
  console.log(`running at http://localhost:${PORT}`);
});
