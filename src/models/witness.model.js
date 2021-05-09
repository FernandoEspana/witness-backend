const { Schema, model, models } = require('mongoose');

const witnessSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  cellphone: {
    type: String,
    required: true,
    minlength: [10, 'cellphone should have at least ten characters']
  },
  city: {
    type: String,
  },
  role: {
    type: String,
    required: true,
    enum: ['ADMIN_ROLE', 'WITNESS_ROLE']
  },
  idCard: {
    type: String,
    validate: {
      async validator(idCard) {
        const witness = await models.Witness.findOne({ idCard });
        return !witness;
      },
      message: 'idCard must be unique'
    }
  },
  // isValidated: {
  //   type: Boolean,
  //   default: false,
  // },
  email: {
    type: String,
    required: true,
    validate: {
      async validator(email) {
        const witness = await models.Witness.findOne({ email });
        return !witness;
      },
      message: 'Email must be unique'
    }  
  }, 
  password: {
    type: String,
  },
  pollingStationID: {
    type:Schema.Types.ObjectId,
    ref: 'PollingStation', 
  }
}, {
  timestamps: true,
});

const Witness = model('Witness', witnessSchema);

module.exports = Witness;