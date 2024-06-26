const router = require('express').Router();
const accountController = require('../controllers/account-controller');
const { authorize } = require('../middleware/middleware');

router.route('/').get(authorize, accountController.getCurrentUser);
router.route('/signup').post(accountController.signUp);
router.route('/signin').post(accountController.signIn);
router.route('/refreshtoken').get(authorize, accountController.RefreshToken);

module.exports = router;
