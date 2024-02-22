const router = require('express').Router();
const accountController = require('../controllers/account-controller');

router.route('/signup').post(accountController.signUp);
router.route('/signin').post(accountController.signIn);

module.exports = router;
