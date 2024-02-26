const router = require('express').Router();
const eventController = require('../controllers/event-controller');
const { authorize } = require('../middleware/middleware');

router.route('/').get(authorize, eventController.fetchEvents);
router.route('/:id').get(authorize, eventController.fetchEventDetail);
router.route('/myevent/:id').get(authorize, eventController.fetchMyEvents);
router.route('/').post(authorize, eventController.addEvent);
router.route('/:id').delete(authorize, eventController.deleteEvent);

module.exports = router;
