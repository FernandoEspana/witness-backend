const router = require('express').Router();
const { create, list, show } = require('../controllers/pollingStation.controller');

router.route('/create').post(create);
router.route('/').get(list);
router.route('/:stationId').put(show);

module.exports = router;