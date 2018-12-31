const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const courseSchema = new Schema({
  name: {
    type: String,
    trim: true,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }

}, 
{timestamps: true});

Course = mongoose.model('Course', courseSchema);

exports.getCourse = async () => {
  try {
    return await Course
      .find()
      .populate('user')
      .select('name user');
  } catch (error) {
    console.log(error);
  }
}

exports.createCourse = async (courseData) => {
  const course = new Course(courseData);

  try {
    return await course.save();
  } catch (error) {
    console.log(error);
  }
}

exports.updateCourse = async (id, data) => {
  try {
    return await Course.findByIdAndUpdate(id, { $set: { ...data }}, { new: true });
  } catch (error) {
    console.log(error)
  }
}

exports.deleteCourse = async (id) => {
  try {
    return await Course.findByIdAndRemove(id);
  } catch (error) {
    console.log(error)
  }
}