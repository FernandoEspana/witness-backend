const router = require('express').Router();
const { create } = require('../controllers/pollingStation.controller');

router.route('/create').post(create);



module.exports = router;