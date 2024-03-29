const router = require('express').Router();
const profileController = require('../controllers/profile-controller');
const { authorize } = require('../middleware/middleware');

router.route('/:id').get(authorize, profileController.fetchUserProfile);
router.route('/:id').patch(authorize, profileController.editUserProfile);
router
  .route('/area/:postalcode')
  .get(authorize, profileController.getProfileByArea);

router.route('/uploadPhoto/:id').post(profileController.uploadPhoto);
router.route('/metrics/:id').get(profileController.getMetrics);

module.exports = router;
