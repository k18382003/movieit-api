const router = require('express').Router();
const profileController = require('../controllers/profile-controller');
const { authorize } = require('../middleware/middleware');

router.route('/:id').get(authorize, profileController.fetchUserProfile);
router.route('/:id').patch(authorize, profileController.editUserProfile);

module.exports = router;
