const Joi = require('joi');
const Course = require('../models/course');

exports.index = (req, res, next) => {
  Course.getCourse()
    .then(courses => {
      res.status(200).json({
        courses: courses
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

  const course = {
    ...req.body
  };

  Course.createCourse(course)
    .then(course => {
      return res.status(201).json({
        message: 'Course Created',
        course: course
      });
    })
    .catch(error => {
      console.log(error);
    });
}

exports.show = (req, res, next) => {

}

exports.update = (req, res, next) => {
  const course = courses.find(c => c.id === parseInt(req.params.id));

  if(!course) {
    return res.status(404).json({
      message: `Course with id ${req.params.id} not found`
    });
  }

  // Validate
  // If invalid, return 400 - Bad request
  const { error } = validateCourse(req.body);
  if(error){
    return res.status(400).json({
      message: error.details[0].message
    });
  }

  course.name = req.body.name;
  res.status(201).json({
    message: 'Course Updated',
    course: course
  });
}

exports.delete = (req, res, next) => {
  const course = courses.find(c => c.id === parseInt(req.params.id));

  if(!course) {
    return res.status(404).json({
      message: `Course with id ${req.params.id} not found`
    });
  }

  const index = courses.indexOf(course);
  courses.splice(index, 1);

  res.status(201).json({
    message: 'Course Deleted',
    course: course
  });
}

function validateCourse(course){
  const schema = {
    name: Joi.string().min(3).required(),
    user: Joi.string().min(3).required()
  };

  return Joi.validate(course, schema); 
}