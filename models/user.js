const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const _ = require('lodash');
const bcrypt = require('bcrypt');

const userSchema = new Schema({
  email: { type: String, trim: true, required: true, unique: true },
  name: { type: String, trim: true, required: true },
  password: { type: String, trim: true, required: true }
}, { timestamps: true });

User = mongoose.model('User', userSchema);

exports.getUsers = async () => {
  try {
    return await User.find()
  } catch (error) {
    console.error(error.message);
  }
}

exports.createUser = async (userData) => {
  // console.log('userData', userData)
  
  const user = new User(_.pick(userData, ['name', 'email', 'password']));
  
  try {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    return await user.save();
  } catch (error) {
    console.error(error.message);
  }
}

exports.getUser = async (id) => {
  try {
    return await User.findById(id)
  } catch (error) {
    console.error(error.message);
  }
}

exports.updateUser = async (id, data) => {
  try {
    return await User.findByIdAndUpdate(id, { $set: { ...data }}, {new: true});
  } catch (error) {
    console.error(error.message);
  }
}

exports.deleteUser = async (id) => {
  try {
    return await User.findByIdAndRemove(id);
  } catch (error) {
    console.error(error.message);
  }
}

exports.checkUserExist = async (email) => {
  try {
    let user = await User.findOne({ email: email});
    if(!user) return false;

    return user;
    
  } catch (error) {
    console.log(error)
  }
}

