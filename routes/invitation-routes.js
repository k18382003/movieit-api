const router = require('express').Router();
const invitationController = require('../controllers/invitation-controller');
const { authorize } = require('../middleware/middleware');

router.route('/:userId').get(authorize, invitationController.fetchInvitations);
router
  .route('/unread/:userId')
  .get(authorize, invitationController.fetchUnreadInvitation);

router.route('/:userId').patch(authorize, invitationController.readInvitation);
router
  .route('/action/:userId')
  .patch(authorize, invitationController.updateAction);

router.route('/').post(authorize, invitationController.addInvitations);

module.exports = router;
