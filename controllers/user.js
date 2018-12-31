require('dotenv').config();

const jwt = require('jsonwebtoken');
const Joi = require('joi');
const User = require('../models/user');
const _ = require('lodash');
const bcrypt = require('bcrypt');

exports.index = (req, res, next) => {
  User.getUsers()
    .then(user => {
      return res.status(200).json({
        users: user
      });
    })
    .catch(error => {
      console.log(error);
    })
}

exports.create = (req, res, next) => {
  const { error } = validateUser(req.body);
  if(error){
    return res.status(400).json({
      message: error.details[0].message
    });
  }

  User.checkUserExist(req.body.email)
    .then(existUser => {

      if(existUser){
        return res.status(400).json({
          message: "user already exist",
          userExist: existUser
        });
      }

      const user = {
        ...req.body
      };
       
      User.createUser(user)
        .then(user => {

          return res.status(201).json({
            message: 'User Created',
            user: _.pick(user, ['_id', 'name', 'email'])
          });
        })
    })
    .catch(error => {
      console.log(error);
    });


}

exports.show = (req, res, next) => {
  const user = User.getUser(req.params.id)
    .then(user => {

      if(!user) {
        return res.status(404).json({
          message: `User with id ${req.params.id} not found`
        });
      }
      
      return res.status(200).json({
        user: user
      });
    })
    .catch(error => {
      console.log(error);
    })
}

exports.update = (req, res, next) => {
  // Validate
  // If invalid, return 400 - Bad request
  const { error } = validateUser(req.body);
  if(error){
    return res.status(400).json({
      message: error.details[0].message
    });
  }

  User.updateUser(req.params.id, req.body)
    .then(user => {

      if(!user) {
        return res.status(404).json({
          message: `User with id ${req.params.id} not found`
        });
      }
      
      res.status(201).json({
        message: 'User Updated',
        user: user
      });

    })
    .catch(error => {
      console.log(error);
    }) 
}

exports.delete = (req, res, next) => {
  User.deleteUser(req.params.id)
    .then(user => {

      if(!user) {
        return res.status(404).json({
          message: `User with id ${req.params.id} not found`
        });
      }
      
      res.status(200).json({
        message: 'User Deleted'
      });

    })
    .catch(error => {
      console.log(error);
    }) 
}

exports.login = async (req, res, next) => {
  const { error } = authValidate(req.body);
  if(error){
    return res.status(400).json({
      message: error.details[0].message
    });
  }

  const user = await User.checkUserExist(req.body.email)
  
  if(!user){
    return res.status(400).json({
      message: "Invalid Email or Password",
    });
  }

  const validPassword = await bcrypt.compare(req.body.password, user.password);

  if(!validPassword) {
    return res.status(400).json({
      message: "Invalid Email or Password",
    }); 
  }

  const token = jwt.sign(_.pick(user, ['name', 'email']), process.env.jwtprivatekey);

  res.status(200).json({
    login: true,
    token: token
  });
  
    /* .then(user => {

      
    })
    .catch(error => {
      console.log(error);
    });

 */
}

function validateUser(user){
  const schema = {
    name: Joi.string().min(3).required(),
    email: Joi.string().email({minDomainAtoms: 2}).required(),
    password: Joi.string().required() 
  };

  return Joi.validate(user, schema); 
}

function authValidate(user){
  const schema = {
    email: Joi.string().email({minDomainAtoms: 2}).required(),
    password: Joi.string().required() 
  };

  return Joi.validate(user, schema); 
}