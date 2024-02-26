const router = require('express').Router();
const participantController = require('../controllers/participant-controller');
const { authorize } = require('../middleware/middleware');

router
  .route('/:eventId')
  .get(authorize, participantController.fetchParticipants);

module.exports = router;
