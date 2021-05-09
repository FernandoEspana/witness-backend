const router = require('express').Router();
const { create, activate, destroy, login } = require('../controllers/witness.controller');

router.route('/register').post(create);
router.route('/activate').post(activate);
router.route('/delete').delete(destroy);
router.route('/login').post(login);

module.exports = router;