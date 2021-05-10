const router = require('express').Router();
const { 
  create, 
  activate, 
  destroy, 
  login,
  update, 
} = require('../controllers/witness.controller');

router.route('/register').post(create);
router.route('/activate').post(activate);
router.route('/delete').delete(destroy);
router.route('/login').post(login);
router.route('/:userId').put(update);

module.exports = router;