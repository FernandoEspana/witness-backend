const PollingStation = require('../models/pollingStation.model');


module.exports = {
  async create(req, res) {
    try{
      const { body } = req;
      const pollingStation = await PollingStation.create(body);
      res.status(201).json({
        message: 'Puesto de votación creado satisfactoriamente',
        pollingStation,
      });
    } catch (error) {
      res.status(400).json({message: error});
    }
  }
}