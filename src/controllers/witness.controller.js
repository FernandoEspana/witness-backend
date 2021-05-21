const Witness = require('../models/witness.model');
const PollingStation = require('../models/pollingStation.model');
const mailgun = require("mailgun-js");
const jwt = require('jsonwebtoken');
const DOMAIN = 'sandboxef40a090561a4b02a644591761092ef8.mailgun.org';
const mg = mailgun({apiKey: process.env.MAILGUN_API_KEY, domain: DOMAIN});


module.exports = {
  async login(req, res) {
    try {
      const { email, password } = req.body;

      const witness = await Witness.findOne({email});
      const isValid = witness.password === password;

      if(!witness || !isValid || witness.role ==! 'ADMIN_ROLE') {
        throw Error('Usuario o contraseña invalida')
      }

      res.status(201).json( witness );
      
    } catch (error) {
      res.status(401).json({ message: error.message })      
    }
  },
  async create(req, res) {
    
    const { email, name, role } = req.body;

    const exists = await Witness.findOne({ email });
    if( exists ) {
      return res.status(400).json({ message: 'Usuario ya existe'});
    } 
    
    const token = jwt.sign(
      { email, name, role },
      process.env.SECRET,
      { expiresIn: '24h'}
    );
    console.log(token);
    const data = {
      from: 'noreply@test.co',
      to: email,
      subject: 'Activacion testigo electoral',
      html: `<h2>Hola ${name}, favor verifica tu cuenta en el link</h2>
        <p><a href="${process.env.CLIENT_URL}/auth/activate/${token}">Ir al sitio</a></p>`
    };
    mg.messages().send(data, function (error, body) {
      if(error) {
        return res.status(400).json({
          message: 'Ocurrio un error al enviar el mensaje'
        })
      }
      console.log(body);
      res.status(200).json({ message: "El email fue enviado con éxito!!"})
    });
    
  },
  async activate(req, res) {
    try {
      const {
        token, 
        cellphone, 
        city, 
        idCard, 
        password, 
        pollingStationID 
      } = req.body;
      let email;
      let role;
      let name;
      if(token) {
        try {
          jwt.verify(token, process.env.SECRET, function(err, decodedToken) {
            if(err){
              throw Error({ message: 'Link expirado o incorrecto'});
            }
            email= decodedToken.email;
            role = decodedToken.role;
            name = decodedToken.name;
          })
          
        } catch (error) {
          return res.status(400).json({ message: 'Link expirado o incorrecto'});
        }
      }
      const exists = await Witness.findOne({ email });
      if( exists ) {
        return res.status(400).json({ message: 'Usuario ya existe'});
      } 
      const witness = await Witness.create({
        email,
        password,
        name, 
        role, 
        cellphone, 
        city,
        idCard, 
        pollingStationID
      });
      const pStation = await PollingStation.findById(pollingStationID);
      pStation.witnessIDs.push(witness._id);
      await pStation.save({ validateBeforeSave: false});
      res.status(200).json({ message: 'Perfil creado satisfactoriamente' });
      }catch(error) {
        res.status(400).json({message: 'Algo salió mal!!'});
      } 
  },
  async update(req, res){
    try {
      const { body, params: { userId } } = req;
      await Witness.findByIdAndUpdate(userId, body, { new: true});
      res.status(200).json({ message: 'Perfil Actualizado' });
    } catch (error) {
      res.status(400).json({ message: 'Perfil no se pudo actulizar' });
    }
  },
  async destroy(req,res) {
    try {
      const { user } = req.body;
      
      const witness = await Witness.findById(user);
      const pollingStation = await PollingStation.findById(witness.pollingStationID);
            
      pollingStation.witnessIDs.pull(witness._id);
      pollingStation.save({validateBeforeSave: false });

      const witnessDeleted = await Witness.findByIdAndDelete(witness._id);
      res.status(200).json({ message: 'Testigo fue borrado', witnessDeleted });
      
    } catch(error){
      res.status(404).json({ message: 'No se ha podido borrar testigo', error});
    }
  }
}