const Joi = require('joi');
const User = require('../models/user');

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
  const { error } = validateCourse(req.body);
  if(error){
    return res.status(400).json({
      message: error.details[0].message
    });
  }

  const user = {
    ...req.body
  };

  User.createUser(user)
    .then(user => {
      return res.status(201).json({
        message: 'User Created',
        user: user
      });
    })
    .catch(error => {
      console.log(error);
    })
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
  const { error } = validateCourse(req.body);
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

function validateCourse(course){
  const schema = {
    name: Joi.string().min(3).required(),
    email: Joi.string().email({minDomainAtoms: 2}).required()
  };

  return Joi.validate(course, schema); 
}