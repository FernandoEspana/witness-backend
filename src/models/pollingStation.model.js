const { Schema, model } = require('mongoose');

const pollingStationSchema = new Schema({
  name: {
    type: String,
    required: [ true, 'Polling station name is required' ],
  },
  address: {
    type: String,
    required: [ true, 'Polling station address is required' ],
  },
  latitud: {
    type: Number,
    required: [ true, 'latitud could not be undefined' ],
  },
  longitud: {
    type: Number,
    required: [ true, 'longitud could not be undefined' ],
  },

  tablesNumber: {
    type: Number,
    required: [ true, 'There are any table in polling station' ],
  },

  witnessIDs: {
    type: [{type: Schema.Types.ObjectId, ref: 'Witness'}]
  }
}, {
  timestamps: true,
});

const PollingStation = model('PollingStation', pollingStationSchema);

module.exports = PollingStation;