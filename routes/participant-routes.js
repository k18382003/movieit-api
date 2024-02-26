const router = require('express').Router();
const participantController = require('../controllers/participant-controller');
const { authorize } = require('../middleware/middleware');

router
  .route('/:eventId')
  .get(authorize, participantController.fetchParticipants);

router.route('/').post(authorize, participantController.AddParticipant);
router
  .route('/:eventId/:userId')
  .delete(authorize, participantController.DeleteParticipant);

module.exports = router;
