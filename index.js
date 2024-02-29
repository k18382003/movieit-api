const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');
const accountRoutes = require('./routes/account-routes');
const profileRoutes = require('./routes/profile-routes');
const eventsRoutes = require('./routes/event-routes');
const participantsRoutes = require('./routes/participant-routes');
const invitationRoutes = require('./routes/invitation-routes');

const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ limit: '25mb' }));

app.get('/movieit/api', (req, res) => {
  res.send('Welcome to movieit api');
});

app.use('/movieit/api/account', accountRoutes);
app.use('/movieit/api/profile', profileRoutes);
app.use('/movieit/api/events', eventsRoutes);
app.use('/movieit/api/participants', participantsRoutes);
app.use('/movieit/api/invitation', invitationRoutes);

app.listen(PORT, () => {
  console.log(`running at http://localhost:${PORT}`);
});
