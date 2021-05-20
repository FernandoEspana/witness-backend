const PollingStation = require('../models/pollingStation.model');
const Witness = require('../models/witness.model');


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
  },
  async list(req, res) {
    try {
      const stations = await PollingStation.find().populate('witnessIDs', '-password');
      const witnesses = await Witness.find();
      let totalTables = 0;
      stations.forEach( (station) => {
        totalTables += station.tablesNumber;
      });
      const tablesLeft = totalTables - witnesses.length;
      
      res.status(200).json({ 
        totalStations: stations.length,
        totalWitneses: witnesses.length,
        percentageCovered: ((witnesses.length / totalTables ) * 100).toFixed(2),
        totalTables,
        tablesLeft,
        stations,
      });
    } catch (error) {
      res.status(400).json({ message: 'Puestos de votacion no encontrados'});
    }
  },
  async show(req, res) {
    try {
      const { stationId } = req.params;
      
      const pollingStation = await PollingStation
        .findById(stationId)
        .populate('witnessIDs', '-passwprd');
      const{ witnessIDs, tablesNumber } = pollingStation;  
      res.status(200).json({
        percentageCovered: ((witnessIDs.length / tablesNumber) * 100).toFixed(2),
        tablesLeft: (tablesNumber - witnessIDs.length),
        pollingStation
      });
    } catch (error) {
      res.status(404).json({ message: 'No se pudo encontrar puesto de votación' });
    }
  }

}